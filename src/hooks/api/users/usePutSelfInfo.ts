import { usersContract } from '@/api/contracts';
import { TsRestCacheEntry } from '@/api/fetcher';
import { PutSelfResponse, usersQuery } from '@/api/query/users';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';
import { ErrorResponse } from '@ts-rest/react-query';
import usersKeys from './keys';

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
      if (newData.accessToken) {
        setAccessToken(newData.accessToken);
      }
      try {
        if (newUserCode === previousUserCode) {
          queryClient.setQueryData<
            TsRestCacheEntry<
              ClientInferResponseBody<typeof usersContract.getInfoContract, 200>
            >
          >(usersKeys.userInfo(previousUserCode), (caches) => {
            if (!caches) return caches;
            return {
              ...caches,
              body: {
                ...caches.body,
                content: {
                  ...caches.body.content,
                  ...payload.body,
                  profileImage: payload.body.profileImage?.startsWith('data:')
                    ? payload.body.profileImage
                    : caches.body.content.profileImage,
                },
              },
            };
          });
        } else {
          queryClient.setQueryData(
            usersKeys.userInfo(previousUserCode),
            undefined
          );
          queryClient.setQueryData<
            TsRestCacheEntry<
              ClientInferResponseBody<typeof usersContract.getInfoContract, 200>
            >
          >(usersKeys.userInfo(newUserCode), (caches) => {
            if (!caches) return caches;
            return {
              ...caches,
              body: {
                ...caches.body,
                content: {
                  ...caches.body.content,
                  ...payload.body,
                  profileImage: payload.body.profileImage?.startsWith('data:')
                    ? payload.body.profileImage
                    : caches.body.content.profileImage,
                },
              },
            };
          });
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
