import { ideasContract, listsContract } from '@/api/contracts';
import { ideasQuery, PostIdeasResponse } from '@/api/query/ideas';
import listsKeys from '@/hooks/api/lists/keys';
import publishKeys from '@/hooks/api/publish/keys';
import { updateInfiniteCaches } from '@/hooks/api/utils';
import { adjustPublishLimitsCache } from '@/hooks/queries/publish/cachesUpdater';
import { toBackendTimestamp } from '@/lib/time';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';

interface UsePostNewIdeaOptions {
  onSuccess?: (data: PostIdeasResponse['content']) => void;
  onError?: (
    error: ErrorResponse<typeof ideasContract.postIdeasContract>
  ) => void;
}

export const usePostNewIdea = (options: UsePostNewIdeaOptions) => {
  const queryClient = useQueryClient();

  return ideasQuery.post.useMutation({
    onSuccess: (response) => {
      const data = response.body.content;
      try {
        updateInfiniteCaches<typeof listsContract.getListsContract>(
          queryClient,
          listsKeys.infiniteIdeas(data.listID),
          (previousPages) => {
            const newIdea = {
              id: data.id,
              title: data.title,
              description: data.description,
              coverImage: data.coverImage,
              externalLink: data.externalLink,
            };
            const updatedAt = toBackendTimestamp(new Date());
            return previousPages.map((page, index) => {
              const content = page.body.content;
              return {
                ...page,
                body: {
                  ...page.body,
                  totalElements: page.body.totalElements + 1,
                  content: {
                    ...content,
                    ideaTotalCount: content.ideaTotalCount + 1,
                    updatedAt,
                    ideas:
                      index === 0 ? [newIdea, ...content.ideas] : content.ideas,
                  },
                },
              };
            });
          }
        );
        adjustPublishLimitsCache(
          queryClient,
          publishKeys.ideasLimits(data.listID),
          1
        );
      } catch (error) {
        console.warn('Refetch failed, but idea was created: ', error);
      } finally {
        options.onSuccess?.(data);
      }
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
};
