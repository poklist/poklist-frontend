import {
  DrawerContext,
  DrawerOpenOptions,
  IDrawerContext,
} from '@/components/Drawer/context';
import { useContext } from 'react';

interface IDrawerControls {
  isOpen: boolean;
  openDrawer: (options?: DrawerOpenOptions) => void;
  closeDrawer: () => void;
  options: DrawerOpenOptions | undefined;
}

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
    openDrawer: (options?: DrawerOpenOptions) =>
      context.openDrawer(drawerId, options),
    closeDrawer: () => context.closeDrawer(drawerId),
    options: context.getDrawerOptions(drawerId),
  };
}
