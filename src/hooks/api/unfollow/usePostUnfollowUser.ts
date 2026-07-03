import {
  followersContract,
  followingsContract,
  unfollowContract,
  usersContract,
} from '@/api/contracts';
import {
  PostUnfollowRequest,
  PostUnfollowResponse,
  unfollowQuery,
} from '@/api/query/unfollow';
import followersKeys from '@/hooks/api/followers/keys';
import followingsKeys from '@/hooks/api/followings/keys';
import unfollowKeys from '@/hooks/api/unfollow/keys';
import usersKeys from '@/hooks/api/users/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import useFollowingStore from '@/stores/useFollowingStore';
import useUserStore from '@/stores/useUserStore';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';
import z from 'zod';

type UsePostUnfollowUserOptions = {
  targetUserCode: z.input<z.ZodString>;
  onSuccess?: (data: PostUnfollowResponse['content']) => void;
  onError?: (
    error: ErrorResponse<typeof unfollowContract.postUnfollowContract>,
    request: PostUnfollowRequest
  ) => void;
};

export const usePostUnfollowUser = (options: UsePostUnfollowUserOptions) => {
  const queryClient = useQueryClient();
  const { setConfirmedIsFollowing } = useFollowingStore();
  const { me } = useUserStore();

  return unfollowQuery.postUnfollow.useMutation({
    mutationKey: unfollowKeys.post(options.targetUserCode),
    onSuccess: (response) => {
      try {
        setConfirmedIsFollowing(options.targetUserCode, false);
        updateEntryCaches<typeof usersContract.getInfoContract>(
          queryClient,
          usersKeys.userInfo(options.targetUserCode),
          (previousBody) => {
            updateEntryCaches<typeof followersContract.getFollowersContract>(
              queryClient,
              followersKeys.user(previousBody.content.id),
              (followersBody) => {
                const newFollowersContent = followersBody.content.filter(
                  (follower) => follower.id !== me.id
                );
                return {
                  ...followersBody,
                  content: newFollowersContent,
                };
              }
            );
            return {
              ...previousBody,
              content: {
                ...previousBody.content,
                isFollowing: false,
                followerCount: (previousBody.content.followerCount || 0) - 1,
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
                followingCount: (previousBody.content.followingCount || 0) - 1,
              },
            };
          }
        );
        updateEntryCaches<typeof followingsContract.getFollowingsContract>(
          queryClient,
          followingsKeys.user(me.id),
          (previousBody) => {
            const newFollowingsContent = previousBody.content.filter(
              (follower) => follower.userCode !== options.targetUserCode
            );
            return { ...previousBody, content: newFollowingsContent };
          }
        );
      } catch (error) {
        console.warn('Refetch failed, but user was unfollowed:', error);
      } finally {
        options.onSuccess?.(response.body.content);
      }
    },
    onError: (error, request) => {
      options.onError?.(error, request.query);
    },
  });
};
