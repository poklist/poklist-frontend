import { useContext } from 'react';
import { DrawerContext, IDrawerContext } from './context';

interface IDrawerControls {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
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
    openDrawer: () => context.openDrawer(drawerId),
    closeDrawer: () => context.closeDrawer(drawerId),
  };
}
