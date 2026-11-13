import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DrawerIds } from '@/constants/Drawer';
import { Trans } from '@lingui/macro';
import { useState } from 'react';

interface EditLockTypeDrawerProps {
  onConfirmReset: (resetReadPermissions: boolean) => void;
}

// drawer 關閉時內容會 unmount，所以每次打開都回到「保留」；按「確認設定」才寫入 form
const ResetUnlockContent: React.FC<EditLockTypeDrawerProps> = ({
  onConfirmReset,
}: EditLockTypeDrawerProps) => {
  const [resetReadPermissions, setResetReadPermissions] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-h2 text-black-text-01">
        <div className="font-bold">
          <Trans>過去已解鎖的使用者怎麼辦？</Trans>
        </div>
        <Trans>更新後，是否保留他們的解鎖資格...</Trans>
      </div>
      <RadioGroup
        value={String(resetReadPermissions)}
        onValueChange={(value) =>
          setResetReadPermissions(value === String(true))
        }
        className="flex flex-col gap-4 rounded-2xl border border-note-gray-06 p-4"
      >
        <div className="flex flex-col gap-1 text-t1">
          <div className="flex gap-2 font-semibold text-black-text-01">
            <RadioGroupItem
              value={String(false)}
              className="h-5 w-5 border-gray-primary-07 focus-visible:ring-smart-purple data-[state=checked]:border-smart-purple data-[state=checked]:bg-smart-purple [&>span>svg]:text-white"
            />
            <Trans>保留已解鎖的讀者資格（建議）</Trans>
          </div>
          <div className="text-black-gray-03">
            <Trans>
              已解鎖的讀者可以繼續查看此名單。只有尚未解鎖的需要使用更新後的方式。
            </Trans>
          </div>
        </div>
        <div className="h-px w-full bg-note-gray-06" />
        <div className="flex flex-col gap-1 text-t1">
          <div className="flex gap-2 font-semibold text-black-text-01">
            <RadioGroupItem
              value={String(true)}
              className="h-5 w-5 border-gray-primary-07 focus-visible:ring-smart-purple data-[state=checked]:border-smart-purple data-[state=checked]:bg-smart-purple [&>span>svg]:text-white"
            />
            <Trans>要求讀者重新解鎖</Trans>
          </div>
          <div className="text-black-gray-03">
            <Trans>
              目前已解鎖的讀者資格將失效。當下次開啟此名單時，所有讀者必須使用更新後的方式重新解鎖。
            </Trans>
          </div>
        </div>
      </RadioGroup>
      <div className="text-t1 text-black-gray-03">
        <Trans>
          此輪的密碼設定或問答回覆等資料將會留存。
          若設定回同樣的上鎖方式時，將可查看此輪的資料。
        </Trans>
      </div>
      <div className="flex justify-end">
        <Button
          data-testid="reset-unlock-confirm"
          onClick={() => onConfirmReset(resetReadPermissions)}
          variant={ButtonVariant.BLACK}
          shape={ButtonShape.ROUNDED_8PX}
          size={ButtonSize.H40}
          className="max-w-min px-3"
        >
          <Trans>確認設定</Trans>
        </Button>
      </div>
    </div>
  );
};

const EditLockTypeDrawer: React.FC<EditLockTypeDrawerProps> = ({
  onConfirmReset,
}: EditLockTypeDrawerProps) => {
  const { closeDrawer } = useDrawer(DrawerIds.RESET_UNLOCK_DRAWER_ID);

  return (
    <DrawerComponent
      drawerId={DrawerIds.RESET_UNLOCK_DRAWER_ID}
      content={<ResetUnlockContent onConfirmReset={onConfirmReset} />}
      isShowClose={true}
      onClose={closeDrawer}
    />
  );
};

export default EditLockTypeDrawer;
