import { listsQuery, PutListsResponse } from '@/api/query/lists';
import { applyUpdatedListToCaches } from '@/hooks/api/lists/applyUpdatedListToCaches';
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
        applyUpdatedListToCaches(queryClient, options.userCode, {
          id: newData.id,
          title: newData.title,
          description: newData.description,
          // 舊 PUT 的 coverImage 以 request 為準
          coverImage: request.body.coverImage,
          externalLink: newData.externalLink,
          categoryID: newData.categoryID,
          type: newData.type,
        });
      } catch (error) {
        console.warn('Refetch failed, but list was edited: ', error);
      } finally {
        options.onSuccess?.(newData);
      }
    },
  });
};
