import { createContext } from 'react';

export interface DrawerOpenOptions {
  isCloseable?: boolean;
  variant?: string;
}

export interface IDrawerContext {
  openDrawers: Map<string, DrawerOpenOptions>;
  openDrawer: (drawerId: string, options?: DrawerOpenOptions) => void;
  closeDrawer: (drawerId: string) => void;
  isDrawerOpen: (drawerId: string) => boolean;
  getDrawerOptions: (drawerId: string) => DrawerOpenOptions | undefined;
}

export const DrawerContext = createContext<IDrawerContext | undefined>(
  undefined
);
