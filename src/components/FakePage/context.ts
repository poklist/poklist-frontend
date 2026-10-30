import { ListLockMethod } from '@/enums/Lists/index.enum';
import { IdeaBody } from '@/types/Idea';
import { createContext } from 'react';

export const FakePageContext = createContext<IFakePageContext | undefined>(
  undefined
);

export type FakePageType = 'editField' | 'listSelector' | 'lockConfig';

export interface FakePagePayloadMap {
  editField: null;
  listSelector: {
    ideaForm: IdeaBody;
  };
  lockConfig: {
    lockMethod: ListLockMethod.PASSWORD | ListLockMethod.QUESTION;
  };
}

// 每個 pageType 各存一份 payload，讀取時以 key 取值即得到對應型別（不需型別斷言）
export type FakePagePayloads = {
  [K in FakePageType]: FakePagePayloadMap[K] | null;
};

export interface IFakePageContext {
  openedPage: FakePageType | null;
  getPayload: <T extends FakePageType>(
    pageType: T
  ) => FakePagePayloadMap[T] | null;
  openFakePage: <T extends FakePageType>(
    pageType: T,
    payload?: FakePagePayloadMap[T]
  ) => void;
  closeFakePage: () => void;
  isOpen: (pageType: FakePageType) => boolean;
}
