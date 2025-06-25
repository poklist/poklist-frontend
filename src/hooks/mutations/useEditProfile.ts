import QueryKeys from '@/config/queryKeys';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import axios from '@/lib/axios';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { IResponse } from '@/types/response';
import { UpdateUserResponse, User } from '@/types/User';
import { t } from '@lingui/core/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from '../useToast';

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
    onSuccess: async (data) => {
      if (!data) {
        throw new Error('Failed to edit profile');
      }
      const [newUserCode, oldUserCode] = [data.userCode, me.userCode];
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
      }
      // NOTE: if we don't await, the profile image might not be updated before navigation
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.USER, newUserCode],
      });
      if (newUserCode !== oldUserCode) {
        queryClient.removeQueries({ queryKey: [QueryKeys.USER, oldUserCode] });
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
          variant: 'success',
        });
      }
      console.error(error);
      navigateTo.user(me.userCode);
      onError?.(error);
    },
  });

  return {
    editProfile: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
