import { unfollowContract, usersContract } from '@/api/contracts';
import {
  PostUnfollowRequest,
  PostUnfollowResponse,
  unfollowQuery,
} from '@/api/query/unfollow';
import unfollowKeys from '@/hooks/api/unfollow/keys';
import usersKeys from '@/hooks/api/users/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import useFollowingStore from '@/stores/useFollowingStore';
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

  return unfollowQuery.postUnfollow.useMutation({
    mutationKey: unfollowKeys.post(options.targetUserCode),
    onSuccess: (response) => {
      try {
        setConfirmedIsFollowing(options.targetUserCode, false);
        updateEntryCaches<typeof usersContract.getInfoContract>(
          queryClient,
          usersKeys.userInfo(options.targetUserCode),
          (previousBody) => {
            return {
              ...previousBody,
              content: {
                ...previousBody.content,
                isFollowing: false,
              },
            };
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
