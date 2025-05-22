import { create } from 'zustand';

export type UIStoreState = {
  scrollToTop: () => void;
  setScrollToTop: (fn: () => void) => void;

  // 管理展開類別的狀態
  expandedCategories: Record<string, boolean>;
  expandCategory: (categoryId: number | string) => void;
};

export const useUIStore = create<UIStoreState>((set) => ({
  scrollToTop: () => {},
  setScrollToTop: (fn: () => void) => set({ scrollToTop: fn }),

  // 展開類別的初始狀態
  expandedCategories: {},

  // 展開特定類別
  expandCategory: (categoryId) =>
    set((state) => ({
      expandedCategories: {
        ...state.expandedCategories,
        [categoryId]: true,
      },
    })),
}));
