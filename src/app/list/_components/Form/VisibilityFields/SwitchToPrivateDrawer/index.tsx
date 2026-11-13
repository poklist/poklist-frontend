import { DrawerComponent } from '@/components/Drawer';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import { DrawerIds } from '@/constants/Drawer';
import { Trans } from '@lingui/macro';

interface SwitchToPrivateDrawerProps {
  onConfirm: () => void;
  onCancel: () => void;
}

// 已上鎖時選「隱藏」：確認後才改成隱藏並關閉上鎖（上鎖與隱藏互斥）
const SwitchToPrivateDrawer = ({
  onConfirm,
  onCancel,
}: SwitchToPrivateDrawerProps) => {
  return (
    <DrawerComponent
      drawerId={DrawerIds.SWITCH_TO_PRIVATE_DRAWER_ID}
      isShowClose={true}
      header={<Trans>此名單內容將全部隱藏</Trans>}
      subHeader={
        <Trans>
          此輪的密碼設定或問答回覆等資料將會留存，若未來設定回同樣的上鎖方式時，即可再次使用或查看此輪的資料。
        </Trans>
      }
      content={<></>}
      startFooter={
        <Button
          onClick={onConfirm}
          data-testid="switch-to-private-confirm"
          variant={ButtonVariant.WARNING}
          shape={ButtonShape.ROUNDED_8PX}
        >
          <Trans>確認關閉上鎖</Trans>
        </Button>
      }
      endFooter={
        <Button
          onClick={onCancel}
          data-testid="switch-to-private-cancel"
          variant={ButtonVariant.BLACK}
          shape={ButtonShape.ROUNDED_8PX}
        >
          <Trans>取消</Trans>
        </Button>
      }
    />
  );
};

export default SwitchToPrivateDrawer;
