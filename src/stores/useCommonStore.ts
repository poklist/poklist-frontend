import { create } from 'zustand';

import { IAlertMessage } from '@/components/Alert';
import { IErrorDrawerMessage } from '@/components/ErrorDrawer';

export type CommonStoreState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  isShowingAlert: boolean;
  alertMessage: IAlertMessage; // Add 'alertMessage' property
  setShowingAlert: (isShowing: boolean, alertMessage?: IAlertMessage) => void;

  errorDrawerMessage: IErrorDrawerMessage;
  setErrorDrawerMessage: (errorMessage: IErrorDrawerMessage) => void;

  isLoginDrawerOpen: boolean;
  setIsLoginDrawerOpen: (isOpen: boolean) => void;
};

const useCommonStore = create<CommonStoreState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  isShowingAlert: false,
  alertMessage: {
    message: '',
  },

  setShowingAlert: (isShowing, alertMessage) => {
    set({
      isShowingAlert: isShowing,
    });

    if (alertMessage) {
      set({
        alertMessage,
      });
    }
  },

  errorDrawerMessage: { title: '', content: '' },
  setErrorDrawerMessage: (errorMessage) => {
    set({ errorDrawerMessage: errorMessage });
  },

  isLoginDrawerOpen: false,
  setIsLoginDrawerOpen: (isOpen) => set({ isLoginDrawerOpen: isOpen }),
}));

export default useCommonStore;
