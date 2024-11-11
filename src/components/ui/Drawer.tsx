import * as Dialog from '@radix-ui/react-dialog';
import React, { createContext, useContext, useState } from 'react';

interface IDrawerContext {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<IDrawerContext | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => {
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

interface IDrawerProps {
  header: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
  isShowClose: boolean;
}
export const Drawer: React.FC<IDrawerProps> = ({ header, content, footer, isShowClose }) => {
  const { isOpen, closeDrawer } = useDrawer();
  return (
    <Dialog.Root open={isOpen} onOpenChange={closeDrawer}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black-text-01 opacity-70 fixed top-0 left-0 w-screen h-screen" />
        <Dialog.Content className="w-full rounded py-6 px-4 outline-none fixed z-20 bottom-0 bg-white shadow">
          {isShowClose && (
            <div className="flex justify-end">
              <Dialog.Close
                aria-label="Close"
                className="h-6 w-6 rounded-full bg-black-text-01 text-center leading-6 text-white mb-3 focus-visible:outline-none"
              >
                <span aria-hidden>×</span>
              </Dialog.Close>
            </div>
          )}
          <Dialog.Title className="relative flex w-full items-center justify-between">
            {header}
          </Dialog.Title>
          <Dialog.Description className="w-full overflow-y-scroll">{content}</Dialog.Description>
          <div className="w-full">{footer}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
