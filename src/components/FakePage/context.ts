import { createContext } from 'react';

export interface IFakePageContext {
  isOpen: boolean;
  openFakePage: () => void;
  closeFakePage: () => void;
}

export const FakePageContext = createContext<IFakePageContext | undefined>(
  undefined
);
