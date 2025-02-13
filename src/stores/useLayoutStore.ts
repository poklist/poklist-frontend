import { create } from 'zustand';

export interface ILayoutStoreState {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

const useLayoutStore = create<ILayoutStoreState>()((set) => ({
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
}));

export default useLayoutStore;
