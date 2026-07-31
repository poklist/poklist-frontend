import { ideasContract, listsContract } from '@/api/contracts';
import { ideasQuery, PutIdeasResponse } from '@/api/query/ideas';
import ideasKeys from '@/hooks/api/ideas/keys';
import listsKeys from '@/hooks/api/lists/keys';
import { updateEntryCaches, updateInfiniteCaches } from '@/hooks/api/utils';
import { toBackendTimestamp } from '@/lib/time';
import { useQueryClient } from '@tanstack/react-query';

interface UsePutIdeaOptions {
  onSuccess?: (data: PutIdeasResponse['content']) => void;
}

export const usePutIdea = (options: UsePutIdeaOptions) => {
  const queryClient = useQueryClient();
  return ideasQuery.put.useMutation({
    onSuccess: (response, request) => {
      const newData = response.body.content;
      try {
        const updatedAt = toBackendTimestamp(new Date());
        updateEntryCaches<typeof ideasContract.getIdeasContract>(
          queryClient,
          ideasKeys.idea(newData.id),
          (previousBody) => {
            return {
              ...previousBody,
              content: {
                ...previousBody.content,
                title: newData.title,
                description: newData.description,
                coverImage:
                  request.body.coverImage ?? previousBody.content.coverImage,
                externalLink: newData.externalLink,
                updatedAt,
              },
            };
          }
        );
        updateInfiniteCaches<typeof listsContract.getListsContract>(
          queryClient,
          listsKeys.infiniteIdeas(newData.listID),
          (previousPages) => {
            return previousPages.map((page) => {
              const content = page.body.content;
              const updatedIdeas = content.ideas.map((idea) =>
                idea.id === newData.id
                  ? {
                      ...idea,
                      title: newData.title,
                      description: newData.description,
                      coverImage: request.body.coverImage ?? idea.coverImage,
                      externalLink: newData.externalLink,
                    }
                  : idea
              );
              return {
                ...page,
                body: {
                  ...page.body,
                  content: { ...content, updatedAt, ideas: updatedIdeas },
                },
              };
            });
          }
        );
        updateInfiniteCaches<typeof ideasContract.getIdeasUnderListContract>(
          queryClient,
          ideasKeys.infiniteIdeasUnderList(newData.listID),
          (previousPages) => {
            return previousPages.map((page) => {
              const body = page.body;
              const updatedIdeas = body.ideas.map((idea) =>
                idea.id === newData.id
                  ? {
                      ...idea,
                      title: newData.title,
                      description: newData.description ?? '',
                      coverImage: request.body.coverImage ?? idea.coverImage,
                      externalLink: newData.externalLink,
                    }
                  : idea
              );
              return {
                ...page,
                body: {
                  ...page.body,
                  ideas: updatedIdeas,
                },
              };
            });
          }
        );
      } catch (error) {
        console.warn('Refetch failed, but idea was edited: ', error);
      } finally {
        options.onSuccess?.(newData);
      }
    },
  });
};
