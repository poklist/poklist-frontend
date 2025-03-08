import React from 'react';

import { cn } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { Trans } from '@lingui/react/macro';
import * as Toast from '@radix-ui/react-toast';

export interface IAlertMessage {
  message: string;
}

// Delay time for alert to disappear
const DELAY_TIME = 2000;

const AlertComponent: React.FC = ({ className }: { className?: string }) => {
  const { isShowingAlert, setShowingAlert, alertMessage } = useCommonStore();

  return (
    <Toast.Provider swipeDirection="up">
      <Toast.Root
        open={isShowingAlert}
        onOpenChange={() => setShowingAlert(false)}
        duration={DELAY_TIME}
        defaultOpen={false}
        className={cn(
          `sticky mr-72 flex w-full justify-between rounded-lg bg-green-bright-01 px-4 py-3 transition-all data-[state=closed]:animate-swipe-up data-[state=open]:animate-swipe-down`,
          className
        )}
      >
        <Trans>
          <Toast.Title className="font-bold text-black-text-01">
            {alertMessage.message}
          </Toast.Title>
        </Trans>
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
