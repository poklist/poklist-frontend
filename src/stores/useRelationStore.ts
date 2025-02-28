import { create } from 'zustand';

export type RelationStoreState = {
  isFollowing: boolean;
  originalIsFollowing: boolean;
  setIsFollowing: (isFollowing: boolean) => void;
  initializeFollowingStatus: (isFollowing: boolean) => void;
};

// NOTE: it seems that this store is simple, but it can also be applied to future features like complex reaction, like an idea or further more.
const useRelationStore = create<RelationStoreState>((set) => ({
  isFollowing: false,
  originalIsFollowing: false,
  setIsFollowing: (isFollowing: boolean) => set({ isFollowing }),
  initializeFollowingStatus: (isFollowing: boolean) =>
    set({ isFollowing: isFollowing, originalIsFollowing: isFollowing }),
}));

export default useRelationStore;
