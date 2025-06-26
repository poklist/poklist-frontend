import HeaderDrawer from '@/components/Drawer/HeaderDrawer';
import { useAuthWrapper } from '@/hooks/useAuth';
import { useState } from 'react';

export interface FollowRelationsDrawerProps {
  drawerTrigger: React.ReactNode;
  headerTitle: string;
  content: (onClose: () => void) => React.ReactNode;
}

const FollowRelationsDrawer: React.FC<FollowRelationsDrawerProps> = ({
  drawerTrigger,
  headerTitle,
  content,
}: FollowRelationsDrawerProps) => {
  const { withAuth } = useAuthWrapper();
  const [isOpen, setIsOpen] = useState(false);
  const openDrawer = withAuth(() => {
    setIsOpen(true);
  });

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => openDrawer()} className="">
        {drawerTrigger}
      </div>
      <HeaderDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        headerTitle={headerTitle}
        headerClassName="p-4 text-h2 font-bold text-black-text-01 border-b border-b-black"
        content={
          <div className="my-6 flex h-[75dvh] max-h-[75dvh] flex-col gap-6 overflow-auto">
            {content(closeDrawer)}
          </div>
        }
      />
    </>
  );
};

export default FollowRelationsDrawer;
