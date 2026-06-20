import { listsContract } from '@/api/contracts';
import { ideasQuery } from '@/api/query/ideas';
import ideasKeys from '@/hooks/api/ideas/keys';
import listsKeys from '@/hooks/api/lists/keys';
import { updateInfiniteCaches } from '@/hooks/api/utils';
import { useQueryClient } from '@tanstack/react-query';
import z from 'zod';

type UseDeleteIdeaOptions = z.infer<z.ZodObject<{ listID: z.ZodString }>>;

export const useDeleteIdea = (options: UseDeleteIdeaOptions) => {
  const queryClient = useQueryClient();
  return ideasQuery.delete.useMutation({
    onSuccess: (_, request) => {
      queryClient.removeQueries({
        queryKey: ideasKeys.idea(request.params.ideaID),
      });
      updateInfiniteCaches<typeof listsContract.getListsContract>(
        queryClient,
        listsKeys.infiniteIdeas(options.listID),
        (previousPages) => {
          return previousPages.map((page) => {
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
          });
        }
      );
    },
  });
};
