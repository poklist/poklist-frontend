import { likeContract, listsContract } from '@/api/contracts';
import { likeQuery, PostLikeRequest, PostLikeResponse } from '@/api/query/like';
import likeKeys from '@/hooks/api/like/keys';
import listsKeys from '@/hooks/api/lists/keys';
import { updateInfiniteCaches } from '@/hooks/api/utils';
import useLikeStore from '@/stores/useLikeStore';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';

type UsePostLikeListOptions = PostLikeRequest & {
  onSuccess?: (data: PostLikeResponse['content']) => void;
  onError?: (
    error: ErrorResponse<typeof likeContract.postLikeContract>,
    request: PostLikeRequest
  ) => void;
};

export const usePostLikeList = (options: UsePostLikeListOptions) => {
  const queryClient = useQueryClient();
  const { setConfirmedIsLiked } = useLikeStore();

  return likeQuery.postLike.useMutation({
    mutationKey: likeKeys.post(options.listID),
    onSuccess: (response) => {
      try {
        setConfirmedIsLiked(options.listID, true);
        updateInfiniteCaches<typeof listsContract.getListsContract>(
          queryClient,
          listsKeys.infiniteIdeas(options.listID),
          (previousPages) => {
            return previousPages.map((page) => {
              return {
                ...page,
                body: {
                  ...page.body,
                  content: {
                    ...page.body.content,
                    isLiked: true,
                    likeCount: page.body.content.likeCount + 1,
                  },
                },
              };
            });
          }
        );
      } catch (error) {
        console.warn('Refetch failed, but list was liked: ', error);
      } finally {
        options.onSuccess?.(response.body.content);
      }
    },
    onError: (error, request) => {
      options.onError?.(error, request.body);
    },
  });
};
