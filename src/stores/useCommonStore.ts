import { create } from 'zustand';

import { IAlertMessage } from '@/components/Alert';
import { IErrorDrawerMessage } from '@/components/ErrorDrawer';

export type CommonStoreState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  isShowingAlert: boolean;
  alertMessage: IAlertMessage; // Add 'alertMessage' property
  setShowingAlert: (isShowing: boolean, alertMessage?: IAlertMessage) => void;

  isShowErrorDrawer: boolean;
  errorDrawerMessage: IErrorDrawerMessage;
  setShowErrorDrawer: (isShow: boolean, errorMessage?: IErrorDrawerMessage) => void;
};

const useCommonStore = create<CommonStoreState>(set => ({
  isLoading: false,
  setIsLoading: isLoading => set({ isLoading }),

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

  isShowErrorDrawer: false,
  errorDrawerMessage: { title: '', content: '' },
  setShowErrorDrawer: (isShow, errorMessage) => {
    set({ isShowErrorDrawer: isShow });
    if (errorMessage) {
      set({ errorDrawerMessage: errorMessage });
    }
  },
}));

export default useCommonStore;
