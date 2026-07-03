import {
  followContract,
  followersContract,
  followingsContract,
  usersContract,
} from '@/api/contracts';
import {
  followQuery,
  PostFollowRequest,
  PostFollowResponse,
} from '@/api/query/follow';
import followKeys from '@/hooks/api/follow/keys';
import followersKeys from '@/hooks/api/followers/keys';
import followingsKeys from '@/hooks/api/followings/keys';
import usersKeys from '@/hooks/api/users/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import useFollowingStore from '@/stores/useFollowingStore';
import useUserStore from '@/stores/useUserStore';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';
import z from 'zod';

type UsePostFollowUserOptions = {
  targetUserCode: z.input<z.ZodString>;
  onSuccess?: (data: PostFollowResponse['content']) => void;
  onError?: (
    error: ErrorResponse<typeof followContract.postFollowContract>,
    request: PostFollowRequest
  ) => void;
};
export const usePostFollowUser = (options: UsePostFollowUserOptions) => {
  const queryClient = useQueryClient();
  const { setConfirmedIsFollowing } = useFollowingStore();
  const { me } = useUserStore();

  return followQuery.postFollow.useMutation({
    mutationKey: followKeys.post(options.targetUserCode),
    onSuccess: (response) => {
      try {
        setConfirmedIsFollowing(options.targetUserCode, true);
        updateEntryCaches<typeof usersContract.getInfoContract>(
          queryClient,
          usersKeys.userInfo(options.targetUserCode),
          (previousBody) => {
            updateEntryCaches<typeof followingsContract.getFollowingsContract>(
              queryClient,
              followingsKeys.user(me.id),
              (followingsBody) => {
                return {
                  ...followingsBody,
                  content: [
                    ...followingsBody.content,
                    {
                      userCode: options.targetUserCode,
                      id: previousBody.content.id,
                      displayName: previousBody.content.displayName,
                      isFollowing: true,
                      profileImage: previousBody.content.profileImage,
                    },
                  ],
                };
              }
            );
            updateEntryCaches<typeof followersContract.getFollowersContract>(
              queryClient,
              followersKeys.user(previousBody.content.id),
              (followersBody) => {
                return {
                  ...followersBody,
                  content: [
                    ...followersBody.content,
                    {
                      userCode: me.userCode,
                      id: me.id,
                      displayName: me.displayName,
                      profileImage: me.profileImage,
                      isFollowing: true,
                    },
                  ],
                };
              }
            );
            return {
              ...previousBody,
              content: {
                ...previousBody.content,
                isFollowing: true,
                followerCount: (previousBody.content.followerCount || 0) + 1,
              },
            };
          }
        );
        updateEntryCaches<typeof usersContract.getInfoContract>(
          queryClient,
          usersKeys.userInfo(me.userCode),
          (previousBody) => {
            return {
              ...previousBody,
              content: {
                ...previousBody.content,
                followingCount: (previousBody.content.followingCount || 0) + 1,
              },
            };
          }
        );
      } catch (error) {
        console.warn('Refetch failed, but user was followed:', error);
      } finally {
        options.onSuccess?.(response.body.content);
      }
    },
    onError: (error, request) => {
      options.onError?.(error, request.query);
    },
  });
};
