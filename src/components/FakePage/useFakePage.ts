import { useContext } from 'react';
import { FakePageContext, IFakePageContext } from './context';

export const useFakePage = (): IFakePageContext => {
  const context = useContext(FakePageContext);
  if (!context) {
    throw new Error('useFakePage must be used within a FakePageProvider');
  }
  return context;
};
