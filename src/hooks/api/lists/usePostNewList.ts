import { listsContract } from '@/api/contracts';
import { TsRestCacheEntry } from '@/api/fetcher';
import { listsQuery, PostListsResponse } from '@/api/query/lists';
import listsKeys from '@/hooks/api/lists/keys';
import { useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';
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
        queryClient.setQueryData<
          TsRestCacheEntry<
            ClientInferResponseBody<
              typeof listsContract.getUserListsContract,
              200
            >
          >
        >(listsKeys.userLists(options.userCode), (caches) => {
          if (!caches) return caches;
          return {
            ...caches,
            body: {
              ...caches.body,
              content: [data, ...caches.body.content],
            },
          };
        });
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
