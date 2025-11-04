import {
  FakePageContext,
  IFakePageContext,
} from '@/components/FakePage/context';
import { useContext } from 'react';

export const useFakePage = (): IFakePageContext => {
  const context = useContext(FakePageContext);
  if (!context) {
    throw new Error('useFakePage must be used within a FakePageProvider');
  }
  return context;
};
