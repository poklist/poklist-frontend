import { listsContract } from '@/api/contracts';
import { TsRestCacheEntry } from '@/api/fetcher';
import { listsQuery } from '@/api/query/lists';
import listsKeys from '@/hooks/api/lists/keys';
import { useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';
import { ErrorResponse } from '@ts-rest/react-query';
import z from 'zod';

type UseDeleteListSchema = z.input<z.ZodObject<{ userCode: z.ZodString }>>;

type UseDeleteListOptions = UseDeleteListSchema & {
  onSuccess?: () => void;
  onError?: (
    error: ErrorResponse<typeof listsContract.deleteListsContract>
  ) => void;
};

export const useDeleteList = (options: UseDeleteListOptions) => {
  const queryClient = useQueryClient();

  return listsQuery.delete.useMutation({
    onSuccess: (_, request) => {
      try {
        // 將單筆列表資料清空，而非刪除快取，為免因尚有 Component 仍在使用相關資料而重新 fetch
        queryClient.setQueryData(
          listsKeys.infiniteIdeas(request.params.listID),
          undefined
        );
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
              content: caches.body.content.filter(
                (list) => list.id !== request.params.listID
              ),
            },
          };
        });
      } catch (error) {
        console.warn('Refetch failed, but list was deleted:', error);
      } finally {
        options.onSuccess?.();
      }
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
};
