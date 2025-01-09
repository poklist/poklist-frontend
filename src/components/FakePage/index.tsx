import { Dialog, DialogContent } from '@/components/ui/dialog';
import { createContext, useContext, useState } from 'react';

interface IFakePageContext {
  isOpen: boolean;
  openFakePage: () => void;
  closeFakePage: () => void;
}

const FakePageContext = createContext<IFakePageContext | undefined>(undefined);

export const FakePageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
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

export const useFakePage = () => {
  const context = useContext(FakePageContext);
  if (!context) {
    throw new Error('useFakePage must be used within a FakePageProvider');
  }
  return context;
};

interface IFakePageProps {
  content?: React.ReactNode;
}

export const FakePageComponent: React.FC<IFakePageProps> = ({ content }) => {
  const { isOpen, closeFakePage } = useFakePage();
  return (
    <Dialog open={isOpen} onOpenChange={closeFakePage}>
      <DialogContent className="bottom-0 h-screen w-full bg-white shadow">
        {content}
      </DialogContent>
    </Dialog>
  );
};
