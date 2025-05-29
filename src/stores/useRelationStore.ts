import { create } from 'zustand';

export type RelationStoreState = {
  isFollowing: boolean;
  setIsFollowing: (isFollowing: boolean) => void;
};

// NOTE: it seems that this store is simple, but it can also be applied to future features like complex reaction, like an idea or further more.
const useRelationStore = create<RelationStoreState>((set) => ({
  isFollowing: false,
  setIsFollowing: (isFollowing: boolean) => set({ isFollowing }),
}));

export default useRelationStore;
