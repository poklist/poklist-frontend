import { create } from 'zustand';

export type SocialStoreState = {
  isLiked: boolean;
  originalIsLiked: boolean;
  setIsLiked: (isLiked: boolean) => void;
  initializeLikeStatus: (isLiked: boolean) => void;
};

// NOTE: it seems that this store is simple, but it can also be applied to future features like complex reaction, like an idea or further more.
const useSocialStore = create<SocialStoreState>((set) => ({
  isLiked: false,
  originalIsLiked: false,
  setIsLiked: (isLiked: boolean) => set({ isLiked }),
  initializeLikeStatus: (isLiked: boolean) =>
    set({ isLiked: isLiked, originalIsLiked: isLiked }),
}));

export default useSocialStore;
