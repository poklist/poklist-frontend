import {
  listsContract,
  publishContracts,
  usersContract,
} from '@/api/contracts';
import { listsQuery, PostListsResponse } from '@/api/query/lists';
import listsKeys from '@/hooks/api/lists/keys';
import publishKeys from '@/hooks/api/publish/keys';
import usersKeys from '@/hooks/api/users/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';
import z from 'zod';

type UsePostNewListSchema = z.input<z.ZodObject<{ userCode: z.ZodString }>>;

type UsePostNewListOptions = UsePostNewListSchema & {
  onSuccess?: (data: PostListsResponse['content']) => void;
  onError?: (
    error: ErrorResponse<typeof listsContract.postListsContract>
  ) => void;
};

export const usePostNewList = (options: UsePostNewListOptions) => {
  const queryClient = useQueryClient();

  return listsQuery.post.useMutation({
    onSuccess: (response) => {
      const data = response.body.content;
      try {
        updateEntryCaches<typeof listsContract.getUserListsContract>(
          queryClient,
          listsKeys.userLists(options.userCode),
          (previousBody) => {
            return {
              ...previousBody,
              content: [data, ...previousBody.content],
            };
          }
        );
        updateEntryCaches<typeof usersContract.getInfoContract>(
          queryClient,
          usersKeys.userInfo(options.userCode),
          (previousBody) => {
            return {
              ...previousBody,
              content: {
                ...previousBody.content,
                listCount: previousBody.content.listCount + 1,
              },
            };
          }
        );
        updateEntryCaches<typeof publishContracts.getListsLimitsContract>(
          queryClient,
          publishKeys.listsLimits(),
          (previousBody) => {
            if (previousBody.content.isUnlimited) return previousBody;
            return {
              ...previousBody,
              content: {
                ...previousBody.content,
                usedCount: previousBody.content.usedCount + 1,
                remainingCount: (previousBody.content.remainingCount ?? 0) - 1,
              },
            };
          }
        );
      } catch (error) {
        console.warn('Refetch failed, but list was created:', error);
      } finally {
        options.onSuccess?.(data);
      }
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
};
