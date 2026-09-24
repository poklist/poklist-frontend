import { FakePageContext, FakePageType } from '@/components/FakePage/context';
import { IdeaBody } from '@/types/Idea';
import { useState } from 'react';

export const FakePageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openedPage, setOpenedPage] = useState<FakePageType | null>(null);
  const [payload, setPayload] = useState<{
    ideaForm: IdeaBody;
  } | null>(null);
  const openFakePage = (
    pageType: FakePageType,
    data?: {
      ideaForm: IdeaBody;
    } | null
  ) => {
    setOpenedPage(pageType);
    if (data) setPayload(data);
  };

  const closeFakePage = () => {
    setOpenedPage(null);
  };
  const isOpen = (pageType: FakePageType) => openedPage === pageType;

  return (
    <FakePageContext.Provider
      value={{
        isOpen,
        openedPage,
        payload,
        openFakePage,
        closeFakePage,
      }}
    >
      {children}
    </FakePageContext.Provider>
  );
};
