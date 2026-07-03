import { usePostLikeList } from '@/hooks/api/like/usePostLikeList';
import { usePostUnlikeList } from '@/hooks/api/unlike/usePostUnlikeList';
import { createDebouncedRegistry } from '@/hooks/mutations/optimistic/debounceRegistry';
import {
  LikeActionOptions,
  LikeActionReturn,
} from '@/hooks/mutations/optimistic/likeUnlike/schema';
import useLikeStore from '@/stores/useLikeStore';

const likeDebounce = createDebouncedRegistry('like');

export const useLikeAction = ({
  listID,
  debounceMs = 5000,
  shouldAllow,
  onNotAllowed,
  onSuccess,
  onError,
}: LikeActionOptions): LikeActionReturn => {
  const { setIsLiked, getConfirmedIsLiked, hasConfirmedLikeState } =
    useLikeStore();

  const likeMutation = usePostLikeList({
    listID,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error, request) => {
      setIsLiked(listID, false);
      onError?.(error, request);
    },
  });

  const unlikeMutation = usePostUnlikeList({
    listID,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error, request) => {
      setIsLiked(listID, true);
      onError?.(error, request);
    },
  });

  const createDebouncedAction = (optimisticValue: boolean) => {
    return () => {
      if (shouldAllow && !shouldAllow()) {
        onNotAllowed?.();
        return;
      }

      setIsLiked(listID, optimisticValue);

      likeDebounce.schedule(listID, debounceMs, () => {
        if (
          hasConfirmedLikeState(listID) &&
          optimisticValue === getConfirmedIsLiked(listID)
        )
          return;

        // 依 optimistic 狀態選擇正確 mutation
        const targetMutation = optimisticValue ? likeMutation : unlikeMutation;
        targetMutation.mutate({ query: { listID }, body: { listID } });
      });
    };
  };

  const like = createDebouncedAction(true);
  const unlike = createDebouncedAction(false);
  const cancelPending = () => likeDebounce.cancel(listID);
  // 回傳任一 mutation 的狀態（因為同時只會有一個 active）
  const activeMutation = likeMutation.isPending ? likeMutation : unlikeMutation;

  return {
    like,
    unlike,
    cancelPending,
    isLoading: activeMutation.isPending,
    isPending: activeMutation.isPending,
    isError: activeMutation.isError,
    isSuccess: activeMutation.isSuccess,
    error: activeMutation.error,
    data: activeMutation.data,
  };
};
