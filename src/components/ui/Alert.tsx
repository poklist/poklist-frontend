import React from 'react';

import { cn } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import * as Toast from '@radix-ui/react-toast';

export interface IAlertMessage {
  message: string;
}

// Delay time for alert to disappear
const DELAY_TIME = 1500;

const AlertComponent: React.FC = ({ className }: { className?: string }) => {
  const { isShowingAlert, setShowingAlert, alertMessage } = useCommonStore();

  return (
    <Toast.Provider swipeDirection="down">
      <Toast.Root
        open={isShowingAlert}
        onOpenChange={() => setShowingAlert(false)}
        duration={DELAY_TIME}
        defaultOpen={false}
        className={cn(
          `mx-1 flex justify-between rounded-lg bg-green-bright-01 px-4 py-3`,
          className
        )}
      >
        <Toast.Title className="font-bold text-black-text-01">
          {alertMessage.message}
        </Toast.Title>
        <Toast.Close
          aria-label="Close"
          className="h-5 w-5 rounded-full bg-black-text-01 text-center leading-5 text-green-bright-01"
        >
          <span aria-hidden>×</span>
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
};

export default AlertComponent;
