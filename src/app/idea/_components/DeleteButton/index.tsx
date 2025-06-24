import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconTrash from '@/components/ui/icons/TrashIcon';
import { DrawerIds } from '@/constants/Drawer';
import { Trans } from '@lingui/react/macro';
import React from 'react';

interface IDeleteButtonProps {
  // Add any props you need for the page
  deleteCallback: () => void;
}
export const DeleteButton: React.FC<IDeleteButtonProps> = ({
  deleteCallback,
}) => {
  const { openDrawer, closeDrawer } = useDrawer(
    DrawerIds.DELETE_IDEA_DRAWER_ID
  );

  return (
    <>
      <IconTrash
        onClick={() => openDrawer()}
        className="cursor-pointer"
        aria-label="Delete"
      />
      <DrawerComponent
        drawerId={DrawerIds.DELETE_IDEA_DRAWER_ID}
        isShowClose={true}
        header={<Trans>Are you sure you want to delete this idea?</Trans>}
        subHeader={<Trans>Once deleted, this idea cannot be recovered!</Trans>}
        startFooter={
          <Button
            onClick={() => {
              deleteCallback();
              closeDrawer();
            }}
            variant={ButtonVariant.WARNING}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Confirm Delete</Trans>
          </Button>
        }
        endFooter={
          <Button
            onClick={() => closeDrawer()}
            variant={ButtonVariant.BLACK}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Cancel</Trans>
          </Button>
        }
      />
    </>
  );
};
