import { create } from 'zustand';

import { IErrorDrawerMessage } from '@/components/ErrorDrawer';

export type CommonStoreState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  errorDrawerMessage: IErrorDrawerMessage;
  setErrorDrawerMessage: (errorMessage: IErrorDrawerMessage) => void;

  isLoginDrawerOpen: boolean;
  setIsLoginDrawerOpen: (isOpen: boolean) => void;
};

const useCommonStore = create<CommonStoreState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  errorDrawerMessage: { title: '', content: '' },
  setErrorDrawerMessage: (errorMessage) => {
    set({ errorDrawerMessage: errorMessage });
  },

  isLoginDrawerOpen: false,
  setIsLoginDrawerOpen: (isOpen) => set({ isLoginDrawerOpen: isOpen }),
}));

export default useCommonStore;
