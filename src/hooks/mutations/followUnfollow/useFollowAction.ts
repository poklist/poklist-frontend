import { usePostFollowUser } from '@/hooks/api/follow/usePostFollowUser';
import { usePostUnfollowUser } from '@/hooks/api/unfollow/usePostUnfollowUser';
import {
  cancelFollowAction,
  scheduleFollowAction,
} from '@/hooks/mutations/followUnfollow/followDebounce';
import {
  FollowActionOptions,
  FollowActionReturn,
  FollowTarget,
} from '@/hooks/mutations/followUnfollow/schema';
import { useFollowCountCacheUpdater } from '@/hooks/mutations/followUnfollow/useFollowCountCachesUpdate';
import { useFollowListCacheUpdater } from '@/hooks/mutations/followUnfollow/useFollowListCachesUpdate';
import { createOptimisticUpdateHandler } from '@/hooks/mutations/optimistic/optimisticUpdateHandler';
import useFollowingStore from '@/stores/useFollowingStore';

export const useFollowAction = ({
  target,
  currentUserCode,
  currentUserID,
  debounceMs = 5000,
  shouldAllow,
  onNotAllowed,
  onSuccess,
  onError,
}: FollowActionOptions): FollowActionReturn => {
  const {
    setIsFollowing,
    getConfirmedIsFollowing,
    hasConfirmedFollowingState,
  } = useFollowingStore();

  const { updateListCaches } = useFollowListCacheUpdater({
    listOwnerUserID: currentUserID,
  });
  const { updateCountCaches } = useFollowCountCacheUpdater({
    listOwnerUserCode: currentUserCode,
  });

  const updateFollowCache = (
    targetUserID: FollowTarget['userID'],
    isFollowing: boolean,
    countDelta: number
  ) => {
    setIsFollowing(target.userCode, isFollowing);
    updateListCaches(targetUserID, isFollowing);
    updateCountCaches(countDelta);
  };

  const followMutation = usePostFollowUser({
    targetUserCode: target.userCode,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error, request) => {
      createOptimisticUpdateHandler(
        1,
        request.userID,
        updateFollowCache
      ).rollback();
      onError?.(error, request);
    },
  });

  const unfollowMutation = usePostUnfollowUser({
    targetUserCode: target.userCode,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error, request) => {
      createOptimisticUpdateHandler(
        -1,
        request.userID,
        updateFollowCache
      ).rollback();
      onError?.(error, request);
    },
  });

  const createDebouncedAction = (optimisticValue: boolean) => {
    return () => {
      if (shouldAllow && !shouldAllow()) {
        onNotAllowed?.();
        return;
      }

      const delta = optimisticValue ? 1 : -1;
      createOptimisticUpdateHandler(
        delta,
        target.userID,
        updateFollowCache
      ).optimisticUpdate();

      scheduleFollowAction(target.userCode, debounceMs, () => {
        // 僅在「確實有 confirmed 紀錄且與 optimistic 一致」時才略過 API。
        // 沒有紀錄（例如列表 row 未 seed）一律送出，避免 unfollow 靜默失敗。
        if (
          hasConfirmedFollowingState(target.userCode) &&
          optimisticValue === getConfirmedIsFollowing(target.userCode)
        ) {
          return;
        }

        const targetMutation = optimisticValue
          ? followMutation
          : unfollowMutation;
        targetMutation.mutate({ query: { userID: target.userID }, body: {} });
      });
    };
  };

  const follow = createDebouncedAction(true);
  const unfollow = createDebouncedAction(false);

  const cancelPending = () => cancelFollowAction(target.userCode);

  const activeMutation = followMutation.isPending
    ? followMutation
    : unfollowMutation;

  return {
    follow,
    unfollow,
    cancelPending,
    isLoading: activeMutation.isPending,
    isPending: activeMutation.isPending,
    isError: activeMutation.isError,
    isSuccess: activeMutation.isSuccess,
    error: activeMutation.error,
    data: activeMutation.data,
  };
};
