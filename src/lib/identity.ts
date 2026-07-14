import useFollowingStore from '@/stores/useFollowingStore';
import useLikeStore from '@/stores/useLikeStore';
import { getQueryClient } from './queryClient';

export const resetIdentityCaches = () => {
  getQueryClient().clear();
  useFollowingStore.getState().resetFollowingStore();
  useLikeStore.getState().clearAllLikeStatus();
};
