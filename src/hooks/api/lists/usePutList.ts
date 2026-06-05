import { listsContract } from '@/api/contracts';
import { InfiniteCache, TsRestCacheEntry } from '@/api/fetcher';
import { listsQuery, PutListsResponse } from '@/api/query/lists';
import { toBackendTimestamp } from '@/lib/time';
import { useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';
import z from 'zod';
import listsKeys from './keys';

type UsePutIdeaSchema = z.infer<z.ZodObject<{ userCode: z.ZodString }>>;
type UsePutListOptions = UsePutIdeaSchema & {
  onSuccess?: (response: PutListsResponse['content']) => void;
};

export const usePutList = (options: UsePutListOptions) => {
  const queryClient = useQueryClient();
  return listsQuery.put.useMutation({
    onSuccess: (response, request) => {
      const newData = response.body.content;
      try {
        const updatedAt = toBackendTimestamp(new Date());
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
              content: caches.body.content.map((list) =>
                list.id === newData.id
                  ? {
                      ...list,
                      title: newData.title,
                      description: newData.description,
                      coverImage: request.body.coverImage ?? list.coverImage,
                      externalLink: newData.externalLink,
                      categoryID: newData.categoryID,
                    }
                  : list
              ),
            },
          };
        });
        queryClient.setQueryData<
          InfiniteCache<
            ClientInferResponseBody<typeof listsContract.getListsContract, 200>
          >
        >(listsKeys.infiniteIdeas(newData.id), (caches) => {
          if (!caches) return caches;
          return {
            ...caches,
            pages: caches.pages.map((page) => {
              return {
                ...page,
                body: {
                  ...page.body,
                  content: {
                    ...page.body.content,
                    title: newData.title,
                    description: newData.description,
                    coverImage:
                      request.body.coverImage ?? page.body.content.coverImage,
                    externalLink: newData.externalLink,
                    categoryID: newData.categoryID,
                    updatedAt,
                  },
                },
              };
            }),
          };
        });
      } catch (error) {
        console.warn('Refetch failed, but list was edited: ', error);
      } finally {
        options.onSuccess?.(newData);
      }
    },
  });
};
