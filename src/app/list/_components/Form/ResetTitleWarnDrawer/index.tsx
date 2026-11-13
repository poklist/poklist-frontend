import { DrawerComponent } from '@/components/Drawer';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import { DrawerIds } from '@/constants/Drawer';
import { Trans } from '@lingui/macro';

interface ResetTitleWarnDrawerProps {
  onReset: () => void;
  onCancel: () => void;
}

const ResetTitleWarnDrawer = ({
  onReset,
  onCancel,
}: ResetTitleWarnDrawerProps) => (
  <DrawerComponent
    drawerId={DrawerIds.RESET_TITLE_WARN_DRAWER_ID}
    isShowClose={true}
    header={<Trans>已輸入的名單主題將被取代</Trans>}
    subHeader={
      <Trans>
        套用所選主題後，你已填寫的名單主題將被取代，且無法復原。確定要繼續嗎？
      </Trans>
    }
    content={<></>}
    startFooter={
      <Button
        onClick={onReset}
        variant={ButtonVariant.WARNING}
        shape={ButtonShape.ROUNDED_8PX}
        data-testid="title-reset"
      >
        <Trans>確認取代</Trans>
      </Button>
    }
    endFooter={
      <Button
        onClick={onCancel}
        variant={ButtonVariant.BLACK}
        shape={ButtonShape.ROUNDED_8PX}
        data-testid="title-keep"
      >
        <Trans>取消</Trans>
      </Button>
    }
  />
);

export default ResetTitleWarnDrawer;
