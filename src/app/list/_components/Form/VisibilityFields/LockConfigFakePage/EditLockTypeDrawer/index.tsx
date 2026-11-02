import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { DrawerIds } from '@/constants/Drawer';
import { Trans } from '@lingui/macro';

// interface EditLockTypeDrawer {
//   control: Control<z.infer<typeof ListFormSchema>>;
//   onChange: (checked: boolean) => void;
// }

//  {
// control,
// onChange,
// }: EditLockTypeDrawer
const EditLockTypeDrawer: React.FC = () => {
  const { closeDrawer } = useDrawer(DrawerIds.LOCK_TYPE_EDIT_DRAWER_ID);

  // const id = useId();
  // const resetId = `${id}-reset`;
  // const notResetId = `${id}-not-reset`;

  // const onResetChange = (isReset: boolean) => {};

  const drawerContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-h2 text-black-text-01">
        <div className="font-bold">
          <Trans>過去已解鎖的使用者怎麼辦？</Trans>
        </div>
        <Trans>更新後，是否保留他們的解鎖資格...</Trans>
      </div>
      {/* <Controller
        name="resetReadPermissions"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={String(field.value)}
            onValueChange={(value) => onResetChange(value === String(false))}
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
          </RadioGroup>
        )}
      /> */}
      <div className=""></div>
      <div className=""></div>
    </div>
  );
  return (
    <DrawerComponent
      drawerId={DrawerIds.LOCK_TYPE_EDIT_DRAWER_ID}
      content={drawerContent}
      isShowClose={true}
      onClose={closeDrawer}
    />
  );
};

export default EditLockTypeDrawer;
