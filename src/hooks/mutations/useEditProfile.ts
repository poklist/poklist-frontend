import useStrictNavigate from '@/hooks/useStrictNavigate';
import axios from '@/lib/axios';
import useUserStore from '@/stores/useUserStore';
import { IResponse } from '@/types/response';
import { UpdateUserResponse, User } from '@/types/User';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseEditProfileOptions {
  onSuccess?: (data: UpdateUserResponse) => void;
  onError?: (error: any) => void;
}

export const useEditProfile = ({
  onSuccess,
  onError,
}: UseEditProfileOptions = {}) => {
  const { refreshToken, setMe, me } = useUserStore();
  const navigateTo = useStrictNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ newUserInfo }: { newUserInfo: User }) => {
      if (newUserInfo.profileImage === me.profileImage) {
        delete newUserInfo.profileImage;
      }
      const response = await axios.put<IResponse<UpdateUserResponse>>(
        `/users/me`,
        newUserInfo
      );
      return response.data.content;
    },
    onSuccess: async (data) => {
      if (!data) {
        throw new Error('Failed to edit profile');
      }
      const [newUserCode, oldUserCode] = [data.userCode, me.userCode];
      if (data?.accessToken) {
        refreshToken(data.accessToken);
      }
      // NOTE: if we don't await, the profile image might not be updated before navigation
      await queryClient.refetchQueries({ queryKey: ['user', newUserCode] });
      if (newUserCode !== oldUserCode) {
        queryClient.removeQueries({ queryKey: ['user', oldUserCode] });
      }
      setMe({ ...data });
      onSuccess?.(data);
      navigateTo.user(newUserCode);
    },
    onError: (error) => {
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
