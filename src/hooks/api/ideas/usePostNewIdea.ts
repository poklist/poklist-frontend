import { ideasContract } from '@/api/contracts';
import { ideasQuery, PostIdeasResponse } from '@/api/query/ideas';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';
import { applyCreatedIdeaToCaches } from './applyCreatedIdeaToCaches';

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
        applyCreatedIdeaToCaches(queryClient, data);
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
