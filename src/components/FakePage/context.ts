import { IdeaBody } from '@/types/Idea';
import { createContext } from 'react';

export const FakePageContext = createContext<IFakePageContext | undefined>(
  undefined
);

export type FakePageType = 'editField' | 'listSelector';

interface FakePagePayloadMap {
  editField: null;
  listSelector: {
    ideaForm: IdeaBody;
  };
}

export interface IFakePageContext {
  openedPage: FakePageType | null;
  payload: FakePagePayloadMap[FakePageType] | null;
  openFakePage: (
    pageType: FakePageType,
    payload?: FakePagePayloadMap[FakePageType]
  ) => void;
  closeFakePage: () => void;
  isOpen: (pageType: FakePageType) => boolean;
}
