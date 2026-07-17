import { getQueryClient } from '@/lib/queryClient';
import useFollowingStore from '@/stores/useFollowingStore';
import useLikeStore from '@/stores/useLikeStore';

export const resetIdentityCaches = () => {
  getQueryClient().clear();
  useFollowingStore.getState().resetFollowingStore();
  useLikeStore.getState().clearAllLikeStatus();
};
