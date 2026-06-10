import { listsContract, usersContract } from '@/api/contracts';
import { listsQuery, PostListsResponse } from '@/api/query/lists';
import listsKeys from '@/hooks/api/lists/keys';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';
import z from 'zod';
import usersKeys from '../users/keys';
import { updateEntryCaches } from '../utils';

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
          (caches) => {
            return {
              ...caches,
              content: [data, ...caches.content],
            };
          }
        );
        updateEntryCaches<typeof usersContract.getInfoContract>(
          queryClient,
          usersKeys.userInfo(options.userCode),
          (caches) => {
            return {
              ...caches,
              content: {
                ...caches.content,
                listCount: caches.content.listCount + 1,
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
