import { DrawerComponent, useDrawer } from '@/components/Drawer';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconTrash from '@/components/ui/icons/TrashIcon';
import { Trans } from '@lingui/react/macro';
import React from 'react';

interface IDeleteButtonProps {
  // Add any props you need for the page
  deleteCallback: () => void;
}
export const DeleteButton: React.FC<IDeleteButtonProps> = ({
  deleteCallback,
}) => {
  const { openDrawer, closeDrawer } = useDrawer();

  return (
    <>
      <IconTrash
        onClick={() => openDrawer()}
        className="cursor-pointer"
        aria-label="Delete"
      />
      <DrawerComponent
        isShowClose={true}
        header={<Trans>Are you sure you want to delete this idea?</Trans>}
        subHeader={<Trans>Once deleted, this idea cannot be recovered!</Trans>}
        startFooter={
          <Button
            onClick={() => deleteCallback()}
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
