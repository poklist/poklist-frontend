import { create } from 'zustand';

export type UIStoreState = {
  scrollToTop: () => void;
  setScrollToTop: (fn: () => void) => void;
};

export const useUIStore = create<UIStoreState>((set) => ({
  scrollToTop: () => {},
  setScrollToTop: (fn: () => void) => set({ scrollToTop: fn }),
}));
