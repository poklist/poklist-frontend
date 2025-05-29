import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import React, { createContext, useContext, useCallback, useState } from 'react';

interface IDrawerContext {
  openDrawers: Set<string>;
  openDrawer: (drawerId: string) => void;
  closeDrawer: (drawerId: string) => void;
  isDrawerOpen: (drawerId: string) => boolean;
}

interface IDrawerControls {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<IDrawerContext | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openDrawers, setOpenDrawers] = useState<Set<string>>(new Set());

  const openDrawer = useCallback((drawerId: string) => {
    setOpenDrawers((prev) => {
      const newSet = new Set(prev);
      newSet.add(drawerId);
      return newSet;
    });
  }, []);

  const closeDrawer = useCallback((drawerId: string) => {
    setOpenDrawers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(drawerId);
      return newSet;
    });
  }, []);

  const isDrawerOpen = useCallback(
    (drawerId: string) => {
      return openDrawers.has(drawerId);
    },
    [openDrawers]
  );

  const value = {
    openDrawers,
    openDrawer,
    closeDrawer,
    isDrawerOpen,
  };

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
};

export function useDrawer(): IDrawerContext;
export function useDrawer(drawerId: string): IDrawerControls;
export function useDrawer(drawerId?: string) {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }

  if (!drawerId) {
    return context;
  }

  return {
    isOpen: context.isDrawerOpen(drawerId),
    openDrawer: () => context.openDrawer(drawerId),
    closeDrawer: () => context.closeDrawer(drawerId),
  };
}

interface IDrawerProps {
  drawerId: string;
  header?: React.ReactNode;
  subHeader?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  startFooter?: React.ReactNode;
  endFooter?: React.ReactNode;
  isShowClose: boolean;
  className?: string;
  onClose?: () => void;
}
export const DrawerComponent: React.FC<IDrawerProps> = ({
  drawerId,
  header,
  subHeader,
  content,
  startFooter,
  endFooter,
  isShowClose,
  className,
  onClose,
}) => {
  const { isOpen, closeDrawer } = useDrawer(drawerId);

  // 處理關閉事件
  const handleClose = () => {
    closeDrawer();
    if (onClose) {
      onClose();
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DrawerContent
        className={cn('bottom-0 w-full bg-white shadow', className)}
      >
        {isShowClose && (
          <div className="flex justify-end">
            <DrawerClose
              aria-label="Close"
              className="mb-3 h-6 w-6 rounded-full bg-black-text-01 text-center leading-6 text-white focus-visible:outline-none"
              onClick={() => handleClose()}
            >
              <span aria-hidden>×</span>
            </DrawerClose>
          </div>
        )}

        {header && (
          <DrawerHeader className="relative w-full items-center">
            <DrawerTitle className="mb-1 w-fit font-bold text-black-text-01">
              {header}
            </DrawerTitle>
            {subHeader && <DrawerDescription>{subHeader}</DrawerDescription>}
          </DrawerHeader>
        )}
        {content && <>{content}</>}

        {/* 同時有 startFooter 和 endFooter */}
        {startFooter && endFooter && (
          <DrawerFooter className="flex w-full flex-row items-center justify-between">
            <div>{startFooter}</div>
            <div>{endFooter}</div>
          </DrawerFooter>
        )}

        {/* 只有 startFooter */}
        {startFooter && !endFooter && (
          <DrawerFooter className="w-full">{startFooter}</DrawerFooter>
        )}

        {/* 只有 endFooter 或 footer */}
        {!startFooter && endFooter && (
          <DrawerFooter className="flex w-full flex-row justify-end">
            {endFooter}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
