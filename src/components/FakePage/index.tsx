import {
  FakePageContext,
  FakePagePayloadMap,
  FakePagePayloads,
  FakePageType,
} from '@/components/FakePage/context';
import { useState } from 'react';

const emptyPayloads: FakePagePayloads = {
  editField: null,
  listSelector: null,
  lockConfig: null,
};

export const FakePageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openedPage, setOpenedPage] = useState<FakePageType | null>(null);
  const [payloads, setPayloads] = useState<FakePagePayloads>(emptyPayloads);

  const openFakePage = <T extends FakePageType>(
    pageType: T,
    data?: FakePagePayloadMap[T]
  ) => {
    setOpenedPage(pageType);
    // 沒帶 payload 就清空該頁，避免沿用上一次開啟時的資料
    setPayloads(
      (prev) =>
        ({ ...prev, [pageType]: data ?? null }) satisfies FakePagePayloads
    );
  };

  const getPayload = <T extends FakePageType>(pageType: T) =>
    payloads[pageType];

  const closeFakePage = () => {
    setOpenedPage(null);
  };
  const isOpen = (pageType: FakePageType) => openedPage === pageType;

  return (
    <FakePageContext.Provider
      value={{
        isOpen,
        openedPage,
        getPayload,
        openFakePage,
        closeFakePage,
      }}
    >
      {children}
    </FakePageContext.Provider>
  );
};
