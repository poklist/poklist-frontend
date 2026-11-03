import { listsContract } from '@/api/contracts';
import { listsQuery, PostListsResponse } from '@/api/query/lists';
import { applyCreatedListToCaches } from '@/hooks/api/lists/applyCreatedListToCaches';
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
    onSuccess: async (response) => {
      const data = response.body.content;
      try {
        await applyCreatedListToCaches(queryClient, options.userCode, data);
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
