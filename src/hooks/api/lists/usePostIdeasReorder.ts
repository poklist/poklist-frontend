import { listsContract } from '@/api/contracts';
import { InfiniteCache } from '@/api/fetcher';
import {
  GetListsResponse,
  listsQuery,
  PostIdeasReorderResponse,
} from '@/api/query/lists';
import listsKeys from '@/hooks/api/lists/keys';
import { updateEntryCaches, updateInfiniteCaches } from '@/hooks/api/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';
import { ErrorResponse } from '@ts-rest/react-query';
import z from 'zod';

type UsePostIdeasReorderSchema = z.input<
  z.ZodObject<{ listID: z.ZodString; limit: z.ZodNumber }>
>;
type UsePostIdeasReorderOptions = UsePostIdeasReorderSchema & {
  onSuccess?: (response: PostIdeasReorderResponse['content']) => void;
  onError?: (
    error: ErrorResponse<typeof listsContract.postIdeasReorderContract>
  ) => void;
};

export const usePostIdeasReorder = (options: UsePostIdeasReorderOptions) => {
  const queryClient = useQueryClient();

  return listsQuery.postIdeasReorder.useMutation({
    onSuccess: async (response) => {
      try {
        const key = listsKeys.infiniteIdeas(options.listID);
        const cached =
          queryClient.getQueryData<
            InfiniteCache<
              ClientInferResponseBody<typeof listsContract.getListsContract>
            >
          >(key);
        const fetchedIds = new Set(
          cached?.pages.flatMap((p) => p.body.content.ideas.map((i) => i.id))
        );
        const order = response.body.content.ideaOrder;
        if (cached && order.every((id) => fetchedIds.has(id))) {
          updateInfiniteCaches<typeof listsContract.getListsContract>(
            queryClient,
            listsKeys.infiniteIdeas(options.listID),
            (previousPages) => {
              const ideaMap = new Map(
                previousPages
                  .flatMap((page) => page.body.content.ideas)
                  .map((idea) => [idea.id, idea])
              );
              const orderedIdeas = response.body.content.ideaOrder
                .map((id) => ideaMap.get(id))
                .filter(
                  (
                    idea
                  ): idea is GetListsResponse['content']['ideas'][number] =>
                    !!idea
                );
              const limit = options.limit;
              return previousPages.map((page, index) => {
                return {
                  ...page,
                  body: {
                    ...page.body,
                    content: {
                      ...page.body.content,
                      ideas: orderedIdeas.slice(
                        index * limit,
                        (index + 1) * limit
                      ),
                    },
                  },
                };
              });
            }
          );
        } else {
          queryClient.setQueryData<
            InfiniteCache<
              ClientInferResponseBody<
                typeof listsContract.getListsContract,
                200
              >
            >
          >(
            key,
            (caches) =>
              caches && {
                pages: caches.pages.slice(0, 1),
                pageParams: caches.pageParams.slice(0, 1),
              }
          );
          await queryClient.invalidateQueries({ queryKey: key });
        }
        updateEntryCaches<typeof listsContract.getIdeasOrderContract>(
          queryClient,
          listsKeys.ideasOrder(options.listID),
          (previousBody) => {
            return {
              ...previousBody,
              content: [...response.body.content.ideaOrder],
            };
          }
        );
      } catch (error) {
        console.warn('Refetch failed, but ideas were reordered:', error);
      } finally {
        options.onSuccess?.(response.body.content);
      }
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
};
