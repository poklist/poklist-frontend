import { followContract, usersContract } from '@/api/contracts';
import {
  followQuery,
  PostFollowRequest,
  PostFollowResponse,
} from '@/api/query/follow';
import followKeys from '@/hooks/api/follow/keys';
import usersKeys from '@/hooks/api/users/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import useFollowingStore from '@/stores/useFollowingStore';
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

  return followQuery.postFollow.useMutation({
    mutationKey: followKeys.post(options.targetUserCode),
    onSuccess: (response) => {
      try {
        setConfirmedIsFollowing(options.targetUserCode, true);
        updateEntryCaches<typeof usersContract.getInfoContract>(
          queryClient,
          usersKeys.userInfo(options.targetUserCode),
          (previousBody) => {
            return {
              ...previousBody,
              content: {
                ...previousBody.content,
                isFollowing: true,
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
