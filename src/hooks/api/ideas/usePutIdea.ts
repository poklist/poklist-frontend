import { ideasContract, listsContract } from '@/api/contracts';
import { InfiniteCache, TsRestCacheEntry } from '@/api/fetcher';
import { ideasQuery, PutIdeasResponse } from '@/api/query/ideas';
import ideasKeys from '@/hooks/api/ideas/keys';
import listsKeys from '@/hooks/api/lists/keys';
import { toBackendTimestamp } from '@/lib/time';
import { useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';

interface UsePutIdeaOptions {
  onSuccess?: (data: PutIdeasResponse['content']) => void;
}

export const usePutIdea = (options: UsePutIdeaOptions) => {
  const queryClient = useQueryClient();
  return ideasQuery.put.useMutation({
    onSuccess: (response) => {
      const newData = response.body.content;
      try {
        const updatedAt = toBackendTimestamp(new Date());
        queryClient.setQueryData<
          TsRestCacheEntry<
            ClientInferResponseBody<typeof ideasContract.getIdeasContract, 200>
          >
        >(ideasKeys.idea(newData.id), (caches) => {
          if (!caches) return caches;
          return {
            ...caches,
            body: {
              ...caches.body,
              content: {
                ...caches.body.content,
                title: newData.title,
                description: newData.description,
                coverImage: newData.coverImage,
                externalLink: newData.externalLink,
                updatedAt,
              },
            },
          };
        });
        queryClient.setQueryData<
          InfiniteCache<
            ClientInferResponseBody<typeof listsContract.getListsContract, 200>
          >
        >(listsKeys.infiniteIdeas(newData.listID), (caches) => {
          if (!caches) return caches;
          return {
            pageParams: caches.pageParams,
            pages: caches.pages.map((page) => {
              const content = page.body.content;
              const updatedIdeas = content.ideas.map((idea) =>
                idea.id === newData.id ? { ...idea, ...newData } : idea
              );
              return {
                ...page,
                body: {
                  ...page.body,
                  content: { ...content, updatedAt, ideas: updatedIdeas },
                },
              };
            }),
          };
        });
      } catch (error) {
        console.warn('Refetch failed, but idea was edited: ', error);
      } finally {
        options.onSuccess?.(newData);
      }
    },
  });
};
