import { create } from 'zustand';

export type SocialStoreState = {
  isLiked: boolean;
  setIsLiked: (isLiked: boolean) => void;
};

// NOTE: it seems that this store is simple, but it can also be applied to future features like complex reaction, like an idea or further more.
const useSocialStore = create<SocialStoreState>((set) => ({
  isLiked: false,
  setIsLiked: (isLiked: boolean) => set({ isLiked }),
}));

export default useSocialStore;
