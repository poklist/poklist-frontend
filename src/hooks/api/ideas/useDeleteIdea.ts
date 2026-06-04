import { listsContract } from '@/api/contracts';
import { InfiniteCache } from '@/api/fetcher';
import { ideasQuery } from '@/api/query/ideas';
import { useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';
import z from 'zod';
import listsKeys from '../lists/keys';
import ideasKeys from './keys';

type UseDeleteIdeaOptions = z.infer<z.ZodObject<{ listID: z.ZodString }>>;

export const useDeleteIdea = (options: UseDeleteIdeaOptions) => {
  const queryClient = useQueryClient();
  return ideasQuery.delete.useMutation({
    onSuccess: (_, request) => {
      queryClient.removeQueries({
        queryKey: ideasKeys.idea(request.params.ideaID),
      });
      queryClient.setQueryData<
        InfiniteCache<
          ClientInferResponseBody<typeof listsContract.getListsContract, 200>
        >
      >(listsKeys.infiniteIdeas(options.listID), (caches) => {
        if (!caches) return caches;
        return {
          pageParams: caches.pageParams,
          pages: caches.pages.map((page) => {
            const content = page.body.content;
            const filteredIdeas = content.ideas.filter(
              (idea) => idea.id !== request.params.ideaID
            );
            return {
              ...page,
              body: {
                ...page.body,
                totalElements: page.body.totalElements - 1,
                content: {
                  ...content,
                  ideaTotalCount: content.ideaTotalCount - 1,
                  ideas: filteredIdeas,
                },
              },
            };
          }),
        };
      });
    },
  });
};
