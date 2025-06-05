import { createContext } from 'react';

export interface IDrawerContext {
  openDrawers: Set<string>;
  openDrawer: (drawerId: string) => void;
  closeDrawer: (drawerId: string) => void;
  isDrawerOpen: (drawerId: string) => boolean;
}

export const DrawerContext = createContext<IDrawerContext | undefined>(
  undefined
);
