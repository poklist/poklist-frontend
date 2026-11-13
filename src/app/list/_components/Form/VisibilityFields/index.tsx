import LockConfigFakePage from '@/app/list/_components/Form/VisibilityFields/LockConfigFakePage';
import EditLockTypeDrawer from '@/app/list/_components/Form/VisibilityFields/LockConfigFakePage/EditLockTypeDrawer';
import ReplyListFakePage from '@/app/list/_components/Form/VisibilityFields/LockConfigFakePage/QuestionConfigSection/ReplyListFakePage';
import LockTypeDrawer from '@/app/list/_components/Form/VisibilityFields/LockTypeDrawer';
import SwitchToPrivateDrawer from '@/app/list/_components/Form/VisibilityFields/SwitchToPrivateDrawer';
import TurnOffLockDrawer from '@/app/list/_components/Form/VisibilityFields/TurnOffLockDrawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { useFakePage } from '@/components/FakePage/useFakePage';
import SwitchWithIcons, {
  SwitchSize,
  SwitchVariant,
} from '@/components/SwitchWithIcon';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import IconCoin from '@/components/ui/icons/CoinIcon';
import IconKey from '@/components/ui/icons/KeyIcon';
import IconPrivateEye from '@/components/ui/icons/PrivateEyeIcon';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DrawerIds } from '@/constants/Drawer';
import { ListLockMethod, ListType } from '@/enums/Lists/index.enum';
import { ListFormSchema } from '@/types/common';
import { Trans } from '@lingui/macro';
import { useId } from 'react';
import { Control, Controller, useController, useWatch } from 'react-hook-form';
import z from 'zod';

interface VisibilityFieldProps {
  isEdit: boolean;
  hasLockHistory: boolean;
  control: Control<z.infer<typeof ListFormSchema>>;
  onChange: (checked: boolean) => void;
}

const VisibilityFields: React.FC<VisibilityFieldProps> = ({
  isEdit,
  hasLockHistory,
  control,
  onChange,
}: VisibilityFieldProps) => {
  const { openFakePage, closeFakePage } = useFakePage();

  const { openDrawer, closeDrawer } = useDrawer(DrawerIds.LOCK_TYPE_DRAWER_ID);
  const { closeDrawer: closeResetUnlockDrawer } = useDrawer(
    DrawerIds.RESET_UNLOCK_DRAWER_ID
  );
  const { openDrawer: openTurnOffDrawer, closeDrawer: closeTurnOffDrawer } =
    useDrawer(DrawerIds.TURN_OFF_LOCK_DRAWER_ID);
  const {
    openDrawer: openSwitchToPrivateDrawer,
    closeDrawer: closeSwitchToPrivateDrawer,
  } = useDrawer(DrawerIds.SWITCH_TO_PRIVATE_DRAWER_ID);

  const id = useId();
  const publicId = `${id}-public`;
  const privateId = `${id}-private`;
  const lockId = `${id}-lock`;
  const type = useWatch({ control, name: 'type' });
  const { field: lockField } = useController({ control, name: 'lock' });
  const { field: resetReadPermissionsField } = useController({
    control,
    name: 'resetReadPermissions',
  });
  // 開關只反映 form 的 lock：設定頁按「完成」才會變「開」
  const lockMethod = lockField.value.method;
  const isLocked = lockMethod !== ListLockMethod.NONE;

  const onTypeChange = (isPrivate: boolean) => {
    closeDrawer();
    onChange(isPrivate);
    // 上鎖與隱藏互斥
    if (isPrivate) lockField.onChange({ method: ListLockMethod.NONE });
  };

  const onVisibilityChange = (isPrivate: boolean) => {
    if (isPrivate && isLocked) {
      openSwitchToPrivateDrawer();
      return;
    }
    onTypeChange(isPrivate);
  };

  const onConfirmSwitchToPrivate = () => {
    closeSwitchToPrivateDrawer();
    onTypeChange(true);
  };

  const onLockChange = (checked: boolean) => {
    closeDrawer();
    if (checked) {
      onTypeChange(false);
      openDrawer();
    } else {
      openTurnOffDrawer();
    }
  };

  const onConfirmTurnOffLock = () => {
    lockField.onChange({ method: ListLockMethod.NONE });
    closeTurnOffDrawer();
  };

  const unlocked = 19;
  const limit = 20;

  const count = isEdit ? 23 : 0;
  const unread = isEdit ? 2 : 0;

  const onConfirmReset = (resetReadPermissions: boolean) => {
    resetReadPermissionsField.onChange(resetReadPermissions);
    closeResetUnlockDrawer();
    closeFakePage('lockConfig');
    openDrawer();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="my-2 flex flex-col gap-2">
        <div className="text-h2 font-bold text-black-text-01">
          <Trans>名單瀏覽設定</Trans>
        </div>
        <div className="text-t1 text-black-gray-03">
          <Trans>可以隨時更改</Trans>
        </div>
      </div>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={String(field.value)}
            onValueChange={(value) =>
              onVisibilityChange(value === String(ListType.PRIVATE))
            }
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col gap-1 rounded-2xl border border-note-gray-06 bg-white p-4 text-t1">
              <label
                htmlFor={publicId}
                className="flex cursor-pointer flex-col gap-1"
              >
                <div className="flex items-center gap-2 font-semibold text-black-text-01">
                  <RadioGroupItem
                    id={publicId}
                    data-testid="list-visibility-public"
                    value={String(ListType.PUBLIC)}
                    className="h-5 w-5 border-gray-primary-07 focus-visible:ring-smart-purple data-[state=checked]:border-smart-purple data-[state=checked]:bg-smart-purple [&>span>svg]:text-white"
                  />
                  <Trans>公開</Trans>
                </div>
                <div className="text-black-gray-03">
                  <Trans>所有人都能看到</Trans>
                </div>
              </label>
              <div className="my-2 h-px border-b border-note-gray-06" />
              <label
                htmlFor={lockId}
                className="flex cursor-pointer flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2 font-semibold text-black-text-01">
                  <Trans>設定上鎖</Trans>
                  <SwitchWithIcons
                    id={lockId}
                    data-testid="list-lock-switch"
                    checked={isLocked}
                    onCheckedChange={onLockChange}
                    variant={SwitchVariant.LIGHT}
                    size={SwitchSize.SM}
                  />
                </div>
                <div className="text-black-gray-03">
                  <Trans>讀者必須解鎖，才能查看完整名單</Trans>
                </div>
                {isLocked && (
                  <div className="mt-1 flex flex-col gap-2 rounded-2xl border border-black-text-01 bg-yellow-bright-01 p-4">
                    <div className="flex items-center gap-2 text-t1 font-semibold">
                      {lockField.value.method === ListLockMethod.PASSWORD ? (
                        <div className="flex items-center gap-2.5">
                          <IconKey width={21} height={21} />{' '}
                          <Trans>密碼解鎖</Trans>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <IconCoin width={19.5} height={19.5} />
                          <Trans>問題解鎖</Trans>
                        </div>
                      )}
                      <Trans>已設定</Trans>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-t2 text-black-text-01">
                        {lockField.value.method === ListLockMethod.PASSWORD ? (
                          <>
                            <Trans>
                              {unlocked}/{limit} 人已解鎖
                            </Trans>
                            <div className="">
                              <Trans>剩餘 {limit - unlocked} 個名額</Trans>
                            </div>
                          </>
                        ) : (
                          <>
                            <Trans>共 {count} 則回覆</Trans>
                            <div className="">
                              <Trans>{unread} 則未讀</Trans>
                            </div>
                          </>
                        )}
                      </div>
                      <Button
                        onClick={() =>
                          openFakePage('lockConfig', { lockMethod })
                        }
                        variant={ButtonVariant.BLACK}
                        size={ButtonSize.H40}
                        shape={ButtonShape.ROUNDED_8PX}
                      >
                        <Trans>編輯</Trans>
                      </Button>
                    </div>
                  </div>
                )}
              </label>
            </div>
            <label
              htmlFor={privateId}
              className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-note-gray-06 p-4 text-t1"
            >
              <div className="flex items-center gap-2 font-semibold text-black-text-01">
                <RadioGroupItem
                  id={privateId}
                  data-testid="list-visibility-private"
                  value={String(ListType.PRIVATE)}
                  className="h-5 w-5 border-gray-primary-07 focus-visible:ring-smart-purple data-[state=checked]:border-smart-purple data-[state=checked]:bg-smart-purple [&>span>svg]:text-white"
                />
                <Trans>隱藏</Trans>
              </div>
              <ul className="ml-2 list-disc text-black-gray-03">
                <li className="ml-3">
                  <Trans>只有你能看到此名單</Trans>
                </li>
                <li className="ml-3">
                  <Trans>不會公開在個人檔案、首頁或任何搜尋中</Trans>
                </li>
              </ul>
            </label>
          </RadioGroup>
        )}
      />
      <div className="my-2 h-px border-b border-note-gray-06" />
      <div
        data-testid="list-visibility-summary"
        className="flex justify-center text-black-text-01 transition-all"
      >
        {type === ListType.PRIVATE ? (
          <div className="flex items-center gap-1">
            <IconPrivateEye className="h-4" />
            <Trans>隱藏名單 只有你能瀏覽</Trans>
          </div>
        ) : (
          <Trans>公開名單 所有人都可瀏覽</Trans>
        )}
      </div>
      <LockTypeDrawer />
      {hasLockHistory && <EditLockTypeDrawer onConfirmReset={onConfirmReset} />}
      <TurnOffLockDrawer
        onTurnOff={onConfirmTurnOffLock}
        onCancel={closeTurnOffDrawer}
      />
      <SwitchToPrivateDrawer
        onConfirm={onConfirmSwitchToPrivate}
        onCancel={closeSwitchToPrivateDrawer}
      />
      <LockConfigFakePage
        isEdit={isEdit}
        hasLockHistory={hasLockHistory}
        lock={lockField.value}
        onDone={lockField.onChange}
      />
      <ReplyListFakePage />
    </div>
  );
};

export default VisibilityFields;
