import { listsContract } from '@/api/contracts';
import { listsQuery, PutListsResponse } from '@/api/query/lists';
import listsKeys from '@/hooks/api/lists/keys';
import { updateEntryCaches, updateInfiniteCaches } from '@/hooks/api/utils';
import { toBackendTimestamp } from '@/lib/time';
import { useQueryClient } from '@tanstack/react-query';
import z from 'zod';

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
        updateEntryCaches<typeof listsContract.getUserListsContract>(
          queryClient,
          listsKeys.userLists(options.userCode),
          (previousBody) => {
            return {
              ...previousBody,
              content: previousBody.content.map((list) =>
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
            };
          }
        );
        updateInfiniteCaches<typeof listsContract.getListsContract>(
          queryClient,
          listsKeys.infiniteIdeas(newData.id),
          (previousPages) => {
            return previousPages.map((page) => {
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
            });
          }
        );
      } catch (error) {
        console.warn('Refetch failed, but list was edited: ', error);
      } finally {
        options.onSuccess?.(newData);
      }
    },
  });
};
