import { create } from 'zustand';

import { IAlertMessage } from '@/components/ui/Alert';

export type CommonStoreState = {
  isLoading: boolean;
  isShowingAlert: boolean;
  alertMessage: IAlertMessage; // Add 'alertMessage' property

  setIsLoading: (isLoading: boolean) => void;
  setShowingAlert: (isShowing: boolean, alertMessage?: IAlertMessage) => void;
};

const useCommonStore = create<CommonStoreState>(set => ({
  isLoading: false,
  isShowingAlert: false,
  alertMessage: {
    message: ''
  },
  setIsLoading: isLoading => set({ isLoading }),
  setShowingAlert: (isShowing, alertMessage) => {
    set({
      isShowingAlert: isShowing
    });

    if (alertMessage) {
      set({
        alertMessage
      });
    }
  }
}));

export default useCommonStore;
