import { DrawerComponent } from '@/components/Drawer';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import { DrawerIds } from '@/constants/Drawer';
import { Trans } from '@lingui/macro';

interface CancelConfirmDrawerProps {
  onCancelEditing: () => void;
  onContinue: () => void;
}

const CancelConfirmDrawer = ({
  onCancelEditing,
  onContinue,
}: CancelConfirmDrawerProps) => {
  return (
    <DrawerComponent
      drawerId={DrawerIds.CANCEL_LIST_FORM_CONFIRM_DRAWER_ID}
      isShowClose={false}
      header={<Trans>取消後，資料就飛走囉！</Trans>}
      subHeader={<Trans>如果取消，所填的內容都會消失</Trans>}
      content={<></>}
      startFooter={
        <Button
          onClick={onCancelEditing}
          variant={ButtonVariant.WARNING}
          shape={ButtonShape.ROUNDED_5PX}
          data-testid="cancel-confirm"
        >
          <Trans>取消編輯</Trans>
        </Button>
      }
      endFooter={
        <Button
          onClick={onContinue}
          variant={ButtonVariant.BLACK}
          shape={ButtonShape.ROUNDED_5PX}
          data-testid="cancel-continue"
        >
          <Trans>繼續編輯</Trans>
        </Button>
      }
    />
  );
};

export default CancelConfirmDrawer;
