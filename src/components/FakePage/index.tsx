import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import { FakePageContext } from './context';
import { useFakePage } from './useFakePage';

export const FakePageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openFakePage = () => {
    setIsOpen(true);
  };

  const closeFakePage = () => {
    setIsOpen(false);
  };

  return (
    <FakePageContext.Provider
      value={{
        isOpen,
        openFakePage,
        closeFakePage,
      }}
    >
      {children}
    </FakePageContext.Provider>
  );
};

interface IFakePageProps {
  content?: React.ReactNode;
}

export const FakePageComponent: React.FC<IFakePageProps> = ({
  content,
}: IFakePageProps) => {
  const { isOpen, closeFakePage } = useFakePage();
  return (
    <Dialog open={isOpen} onOpenChange={closeFakePage}>
      <DialogContent
        className="bottom-0 h-screen w-full bg-white shadow"
        aria-describedby="fake-page-content"
      >
        {content}
      </DialogContent>
    </Dialog>
  );
};
