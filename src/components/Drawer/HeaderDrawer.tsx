import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

export interface HeaderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  headerTitle: string;
  headerActions?: React.ReactNode;
  content: React.ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  closeButtonClassName?: string;
  isShowClose?: boolean;
}

const HeaderDrawer: React.FC<HeaderDrawerProps> = ({
  isOpen,
  onClose,
  headerTitle,
  headerActions,
  content,
  contentClassName,
  headerClassName,
  closeButtonClassName,
  isShowClose = true,
}: HeaderDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        aria-describedby="header-drawer-description"
        className={cn(
          `bottom-0 w-full border-none bg-white p-0 shadow`,
          contentClassName
        )}
      >
        <DrawerDescription />
        <DrawerHeader
          className={cn(
            `relative flex w-full items-center justify-between`,
            headerClassName
          )}
        >
          <DrawerTitle>{headerTitle}</DrawerTitle>
          {headerActions && <>{headerActions}</>}
          {isShowClose && (
            <div className="flex justify-end">
              <DrawerClose
                aria-label="close drawer"
                className={cn(
                  `h-5 w-5 rounded-full bg-black-text-01 text-center leading-5 text-white focus-visible:outline-none`,
                  closeButtonClassName
                )}
                onClick={() => onClose()}
              >
                <span aria-hidden>×</span>
              </DrawerClose>
            </div>
          )}
        </DrawerHeader>
        {content && <>{content}</>}
      </DrawerContent>
    </Drawer>
  );
};

export default HeaderDrawer;
