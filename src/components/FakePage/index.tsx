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
  replyList: [],
};

export const FakePageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // 已開啟的頁面，依開啟順序；可疊加（例如 lockConfig 上再開 replyList）
  const [openedPages, setOpenedPages] = useState<FakePageType[]>([]);
  const [payloads, setPayloads] = useState<FakePagePayloads>(emptyPayloads);

  const openFakePage = <T extends FakePageType>(
    pageType: T,
    data?: FakePagePayloadMap[T]
  ) => {
    setOpenedPages((prev) => [...prev.filter((p) => p !== pageType), pageType]);
    // 沒帶 payload 就清空該頁，避免沿用上一次開啟時的資料
    setPayloads(
      (prev) =>
        ({ ...prev, [pageType]: data ?? null }) satisfies FakePagePayloads
    );
  };

  const getPayload = <T extends FakePageType>(pageType: T) =>
    payloads[pageType];

  // 只關指定的頁面，其他已開啟的頁面維持開啟
  const closeFakePage = (pageType: FakePageType) => {
    setOpenedPages((prev) => prev.filter((p) => p !== pageType));
  };
  const isOpen = (pageType: FakePageType) => openedPages.includes(pageType);

  return (
    <FakePageContext.Provider
      value={{
        isOpen,
        getPayload,
        openFakePage,
        closeFakePage,
      }}
    >
      {children}
    </FakePageContext.Provider>
  );
};
