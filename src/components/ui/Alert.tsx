import React from "react";

import { cn } from "@/lib/utils";
import useCommonStore from "@/stores/useCommonStore";
import * as Toast from "@radix-ui/react-toast";

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
          `flex justify-between px-4 py-3 bg-green-bright-01 rounded-lg mx-1`,
          className
        )}
      >
        <Toast.Title className="text-black-text-01 font-bold">{alertMessage.message}</Toast.Title>
        <Toast.Close
          aria-label="Close"
          className="rounded-full w-5 h-5 bg-black-text-01 text-green-bright-01 leading-5 text-center"
        >
          <span aria-hidden>×</span>
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
};

export default AlertComponent;
