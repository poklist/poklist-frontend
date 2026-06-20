import { usersContract } from '@/api/contracts';
import { TanStackCache } from '@/api/fetcher';
import usersKeys from '@/hooks/api/users/keys';
import { FollowTarget } from '@/hooks/mutations/followUnfollow/schema';
import { useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';

interface UseFollowCountCacheUpdaterOptions {
  listOwnerUserCode: FollowTarget['userCode'];
}

export const useFollowCountCacheUpdater = ({
  listOwnerUserCode,
}: UseFollowCountCacheUpdaterOptions) => {
  const queryClient = useQueryClient();

  const updateCountCaches = (countDelta: number) => {
    queryClient.setQueryData<
      TanStackCache<
        ClientInferResponseBody<typeof usersContract.getInfoContract, 200>
      >
    >(usersKeys.userInfo(listOwnerUserCode), (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        body: {
          ...oldData.body,
          content: {
            ...oldData.body.content,
            followingCount:
              (oldData.body.content.followingCount || 0) + countDelta,
          },
        },
      };
    });
  };

  return {
    updateCountCaches,
  };
};
