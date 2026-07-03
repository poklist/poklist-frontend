import { DrawerContext, DrawerOpenOptions } from '@/components/Drawer/context';
import { useDrawer } from '@/components/Drawer/useDrawer';
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
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openDrawers, setOpenDrawers] = useState<
    Map<string, DrawerOpenOptions>
  >(new Map());

  const openDrawer = useCallback(
    (drawerId: string, options: DrawerOpenOptions = {}) => {
      setOpenDrawers((prev) => {
        if (prev.has(drawerId)) return prev;
        const newMap = new Map(prev);
        newMap.set(drawerId, options);
        return newMap;
      });
    },
    []
  );

  const closeDrawer = useCallback((drawerId: string) => {
    setOpenDrawers((prev) => {
      if (!prev.has(drawerId)) return prev;
      const newMap = new Map(prev);
      newMap.delete(drawerId);
      return newMap;
    });
  }, []);

  const isDrawerOpen = useCallback(
    (drawerId: string) => {
      return openDrawers.has(drawerId);
    },
    [openDrawers]
  );

  const getDrawerOptions = useCallback(
    (drawerId: string) => openDrawers.get(drawerId),
    [openDrawers]
  );

  const value = {
    openDrawers,
    openDrawer,
    closeDrawer,
    isDrawerOpen,
    getDrawerOptions,
  };

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
};

interface IDrawerProps {
  drawerId: string;
  header?: React.ReactNode;
  subHeader?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  startFooter?: React.ReactNode;
  endFooter?: React.ReactNode;
  isShowClose: boolean;
  isCloseable?: boolean;
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
  isCloseable = true,
  className,
  onClose,
}) => {
  const { isOpen, closeDrawer, options } = useDrawer(drawerId);

  const closeable = options?.isCloseable ?? isCloseable;

  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // 處理關閉事件
  const handleClose = useCallback(() => {
    closeDrawer();
    if (onClose) {
      onClose();
    }
  }, [closeDrawer, onClose]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isOpen) handleClose();
  }, [pathname]);

  return (
    <Drawer
      open={isOpen}
      dismissible={closeable}
      onOpenChange={(open) => {
        if (open) return;
        if (!closeable) return;
        if (isOpen) handleClose();
      }}
    >
      <DrawerContent
        onInteractOutside={(e) => {
          if (!closeable) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!closeable) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          if (!closeable) {
            e.preventDefault();
          }
        }}
        className={cn(
          'bottom-0 flex w-full max-w-full flex-col bg-white shadow',
          className
        )}
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
