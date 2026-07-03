import { listsContract, unlikeContract } from '@/api/contracts';
import {
  PostUnlikeRequest,
  PostUnlikeResponse,
  unlikeQuery,
} from '@/api/query/unlike';
import listsKeys from '@/hooks/api/lists/keys';
import unlikeKeys from '@/hooks/api/unlike/keys';
import { updateInfiniteCaches } from '@/hooks/api/utils';
import useLikeStore from '@/stores/useLikeStore';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';

type UsePostUnlikeListOptions = PostUnlikeRequest & {
  onSuccess?: (data: PostUnlikeResponse['content']) => void;
  onError?: (
    error: ErrorResponse<typeof unlikeContract.postUnlikeContract>,
    request: PostUnlikeRequest
  ) => void;
};

export const usePostUnlikeList = (options: UsePostUnlikeListOptions) => {
  const queryClient = useQueryClient();
  const { setConfirmedIsLiked } = useLikeStore();

  return unlikeQuery.postUnlike.useMutation({
    mutationKey: unlikeKeys.post(options.listID),
    onSuccess: (response) => {
      try {
        setConfirmedIsLiked(options.listID, false);
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
                    isLiked: false,
                    likeCount: page.body.content.likeCount - 1,
                  },
                },
              };
            });
          }
        );
      } catch (error) {
        console.warn('Refetch failed, but list was unlike: ', error);
      } finally {
        options.onSuccess?.(response.body.content);
      }
    },
    onError: (error, request) => {
      options.onError?.(error, request.body);
    },
  });
};
