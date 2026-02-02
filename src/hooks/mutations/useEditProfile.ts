import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import axios from '@/lib/axios';
import useAuthStore from '@/stores/useAuthStore';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IResponse } from '@/types/response';
import { UpdateUserResponse, User } from '@/types/User';
import { t } from '@lingui/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';

interface UseEditProfileOptions {
  onSuccess?: (data: UpdateUserResponse) => void;
  onError?: (error: AxiosError<IResponse<unknown>>) => void;
}

export const useEditProfile = ({
  onSuccess,
  onError,
}: UseEditProfileOptions = {}) => {
  const { setAccessToken, logout } = useAuthStore();
  const { setMe, me } = useUserStore();
  const navigateTo = useStrictNavigateNext();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { setIsLoading } = useCommonStore();

  const mutation = useMutation({
    mutationFn: async ({ newUserInfo }: { newUserInfo: User }) => {
      const params = { ...newUserInfo };
      if (params.profileImage === me.profileImage) {
        delete params.profileImage;
      }
      const response = await axios.put<IResponse<UpdateUserResponse>>(
        `/users/me`,
        params
      );
      return response.data.content;
    },
    onMutate: () => {
      setIsEditing(true);
      setIsLoading(true);
    },
    onSuccess: async (data) => {
      if (!data) {
        throw new Error('Failed to edit profile');
      }
      const [newUserCode, oldUserCode] = [data.userCode, me.userCode];
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
      }
      try {
        // NOTE: if we don't await, the profile image might not be updated before navigation
        await queryClient.refetchQueries({
          queryKey: [QueryKeys.USER, newUserCode],
        });
        if (newUserCode !== oldUserCode) {
          queryClient.removeQueries({ queryKey: [QueryKeys.USER, oldUserCode] });
        }
      } catch (error) {
        console.warn("Refetch failed, but profile was edited:", error)
      }
      setMe({ ...data });
      onSuccess?.(data);
      navigateTo.user(newUserCode);
    },
    onError: (error: AxiosError<IResponse<unknown>>) => {
      if (error.response?.status === 401) {
        logout();
        navigateTo.discovery();

        toast({
          title: t`Please login again`,
          variant: MessageType.SUCCESS,
        });
      }
      console.error(error);
      navigateTo.user(me.userCode);
      onError?.(error);
    },
    onSettled: () => {
      setIsEditing(false);
      setIsLoading(false);
    },
  });

  return {
    editProfile: mutation.mutate,
    isLoading: mutation.isPending || isEditing,
    isError: mutation.isError,
    error: mutation.error,
  };
};
