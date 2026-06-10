import { usersContract } from '@/api/contracts';
import { PutSelfResponse, usersQuery } from '@/api/query/users';
import usersKeys from '@/hooks/api/users/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';

type UsePutSelfInfoOptions = {
  onSuccess?: (data: PutSelfResponse['content']) => void;
  onError?: (
    error: ErrorResponse<typeof usersContract.putUsersContracts>
  ) => void;
};
export const usePutSelfInfo = (options: UsePutSelfInfoOptions) => {
  const { setAccessToken } = useAuthStore();
  const { setMe, me } = useUserStore();
  const queryClient = useQueryClient();

  return usersQuery.putSelf.useMutation({
    onSuccess: (response, payload) => {
      const newData = response.body.content;
      const [newUserCode, previousUserCode] = [newData.userCode, me.userCode];
      if (newData.accessToken.length > 0) {
        setAccessToken(newData.accessToken);
      }
      try {
        if (newUserCode === previousUserCode) {
          updateEntryCaches<typeof usersContract.getInfoContract>(
            queryClient,
            usersKeys.userInfo(previousUserCode),
            (caches) => {
              return {
                ...caches,
                content: {
                  ...caches.content,
                  ...payload.body,
                  profileImage: payload.body.profileImage?.startsWith('data:')
                    ? payload.body.profileImage
                    : caches.content.profileImage,
                },
              };
            }
          );
        } else {
          queryClient.setQueryData(
            usersKeys.userInfo(previousUserCode),
            undefined
          );
          updateEntryCaches<typeof usersContract.getInfoContract>(
            queryClient,
            usersKeys.userInfo(newUserCode),
            (caches) => {
              return {
                ...caches,
                content: {
                  ...caches.content,
                  ...payload.body,
                  profileImage: payload.body.profileImage?.startsWith('data:')
                    ? payload.body.profileImage
                    : caches.content.profileImage,
                },
              };
            }
          );
        }
      } catch (error) {
        console.warn('Refetch failed, but profile was edited:', error);
      } finally {
        setMe({
          ...newData,
          profileImage: newData.profileImage?.startsWith('data:')
            ? newData.profileImage
            : me.profileImage,
        });
        options.onSuccess?.(newData);
      }
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
};
