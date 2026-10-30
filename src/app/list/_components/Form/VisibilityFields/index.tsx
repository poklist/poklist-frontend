import { useDrawer } from '@/components/Drawer/useDrawer';
import SwitchWithIcons, {
  SwitchSize,
  SwitchVariant,
} from '@/components/SwitchWithIcon';
import IconPrivateEye from '@/components/ui/icons/PrivateEyeIcon';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DrawerIds } from '@/constants/Drawer';
import { ListType } from '@/enums/Lists/index.enum';
import { ListFormSchema } from '@/types/common';
import { Trans } from '@lingui/macro';
import { useId, useState } from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import z from 'zod';
import LockConfigFakePage from '@/app/list/_components/Form/VisibilityFields/LockConfigFakePage';
import LockTypeDrawer from '@/app/list/_components/Form/VisibilityFields/LockTypeDrawer';

interface VisibilityFieldProps {
  control: Control<z.infer<typeof ListFormSchema>>;
  onChange: (checked: boolean) => void;
}

const VisibilityFields: React.FC<VisibilityFieldProps> = ({
  control,
  onChange,
}: VisibilityFieldProps) => {
  const { openDrawer, closeDrawer } = useDrawer(DrawerIds.LOCK_TYPE_DRAWER_ID);

  const id = useId();
  const publicId = `${id}-public`;
  const privateId = `${id}-private`;
  const lockId = `${id}-lock`;
  // FUTURE: BE 補上鎖欄位後改接 listForm
  const [isLocked, setIsLocked] = useState(false);
  const type = useWatch({ control, name: 'type' });

  const onTypeChange = (isPrivate: boolean) => {
    closeDrawer();
    onChange(isPrivate);
    if (isPrivate) setIsLocked(false);
  };

  const onLockChange = (isLocked: boolean) => {
    closeDrawer();
    setIsLocked(isLocked);
    if (isLocked) {
      onTypeChange(false);
      openDrawer();
    }
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
              onTypeChange(value === String(ListType.PRIVATE))
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
      <LockTypeDrawer onCancel={() => setIsLocked(false)} />
      <LockConfigFakePage
        onCancel={() => setIsLocked(false)}
        onDone={() => setIsLocked(true)}
      />
    </div>
  );
};

export default VisibilityFields;
