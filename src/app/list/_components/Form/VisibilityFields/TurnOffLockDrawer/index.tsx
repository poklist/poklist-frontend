import { DrawerComponent } from '@/components/Drawer';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import { DrawerIds } from '@/constants/Drawer';
import { Trans } from '@lingui/macro';

interface TurnOffLockDrawerProps {
  onTurnOff: () => void;
  onCancel: () => void;
}

const TurnOffLockDrawer = ({ onTurnOff, onCancel }: TurnOffLockDrawerProps) => {
  return (
    <DrawerComponent
      drawerId={DrawerIds.TURN_OFF_LOCK_DRAWER_ID}
      isShowClose={true}
      header={<Trans>解除上鎖設定後，此名單內容將全部公開</Trans>}
      subHeader={
        <Trans>
          此輪的密碼設定或問答回覆等資料將會留存，若未來設定回同樣的上鎖方式時，即可再次使用或查看此輪的資料。
        </Trans>
      }
      content={<></>}
      startFooter={
        <Button
          onClick={onTurnOff}
          variant={ButtonVariant.WARNING}
          shape={ButtonShape.ROUNDED_8PX}
        >
          <Trans>確認解除上鎖</Trans>
        </Button>
      }
      endFooter={
        <Button
          onClick={onCancel}
          variant={ButtonVariant.BLACK}
          shape={ButtonShape.ROUNDED_8PX}
        >
          <Trans>取消</Trans>
        </Button>
      }
    />
  );
};

export default TurnOffLockDrawer;
