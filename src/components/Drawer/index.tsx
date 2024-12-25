import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
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
  subHeader?: React.ReactNode;
  content?: React.ReactNode;
  footer: React.ReactNode;
  isShowClose: boolean;
}
export const DrawerComponent: React.FC<IDrawerProps> = ({
  header,
  subHeader,
  content,
  footer,
  isShowClose,
}) => {
  const { isOpen, closeDrawer } = useDrawer();
  return (
    <Drawer open={isOpen} onOpenChange={closeDrawer}>
      <DrawerContent className="w-full bottom-0 bg-white shadow">
        {isShowClose && (
          <div className="flex justify-end">
            <DrawerClose
              aria-label="Close"
              className="h-6 w-6 rounded-full bg-black-text-01 text-center leading-6 text-white mb-3 focus-visible:outline-none"
            >
              <span aria-hidden>×</span>
            </DrawerClose>
          </div>
        )}
        <DrawerHeader className="relative w-full items-center">
          <DrawerTitle>{header}</DrawerTitle>
          {subHeader && <DrawerDescription>{subHeader}</DrawerDescription>}
        </DrawerHeader>
        {content && <>{content}</>}
        <DrawerFooter className="w-full">{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
