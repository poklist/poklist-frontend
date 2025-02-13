import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import IconTrash from '@/components/ui/icons/TrashIcon';
import { Trans } from '@lingui/macro';
import React, { useState } from 'react';

interface IDeleteButtonProps {
  // Add any props you need for the page
  deleteCallback: () => void;
}
export const DeleteButton: React.FC<IDeleteButtonProps> = ({ deleteCallback }) => {
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const openDrawer = () => {
    setIsDeleteDrawerOpen(true);
  };
  const closeDrawer = () => {
    setIsDeleteDrawerOpen(false);
  };

  return (
    <>
      <IconTrash onClick={() => openDrawer()} className="cursor-pointer" />
      <Drawer open={isDeleteDrawerOpen} onOpenChange={closeDrawer}>
        <DrawerContent className="w-full bottom-0 bg-white shadow">
          <div className="flex justify-end">
            <DrawerClose
              aria-label="Close"
              className="h-6 w-6 rounded-full bg-black-text-01 text-center leading-6 text-white mb-3 focus-visible:outline-none"
            >
              <span aria-hidden>×</span>
            </DrawerClose>
          </div>
          <DrawerHeader className="relative w-full items-center">
            <DrawerTitle>
              <Trans>Deleting the list title will also erase all ideas!</Trans>
            </DrawerTitle>
            <DrawerDescription>
              <Trans>
                Permanently delete the entire list and all its ideas. This action cannot be undone!
              </Trans>
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex justify-between items-center mt-4">
            <Button onClick={() => deleteCallback()} variant="warning" shape="rounded8px">
              <Trans>Delete List and All Ideas</Trans>
            </Button>
            <Button onClick={() => closeDrawer()} variant="black" shape="rounded8px">
              <Trans>Cancel</Trans>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
