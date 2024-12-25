import { cn } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';

export interface IErrorDrawerMessage {
  title: string;
  content: string;
}

export const ErrorDrawer: React.FC = ({ className }: { className?: string }) => {
  const { isShowErrorDrawer, setShowErrorDrawer, errorDrawerMessage } = useCommonStore();
  return (
    <Drawer open={isShowErrorDrawer} onOpenChange={setShowErrorDrawer}>
      <DrawerContent className={cn(`bottom-0 bg-white shadow`, className)}>
        <div className="flex justify-end">
          <DrawerClose
            aria-label="Close"
            className="h-6 w-6 rounded-full bg-black-text-01 text-center leading-6 text-white mb-3 focus-visible:outline-none"
          >
            <span aria-hidden>×</span>
          </DrawerClose>
        </div>
        <DrawerHeader className="relative w-full items-center">
          <DrawerTitle>{errorDrawerMessage.title}</DrawerTitle>
          <DrawerDescription>{errorDrawerMessage.content}</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
