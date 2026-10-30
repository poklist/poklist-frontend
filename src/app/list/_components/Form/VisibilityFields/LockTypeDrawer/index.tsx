import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { useFakePage } from '@/components/FakePage/useFakePage';
import IconCoin from '@/components/ui/icons/CoinIcon';
import IconKey from '@/components/ui/icons/KeyIcon';
import IconLeftArrowThin from '@/components/ui/icons/LeftArrowThinIcon';
import { DrawerIds } from '@/constants/Drawer';
import { ListLockMethod } from '@/enums/Lists/index.enum';
import { Trans } from '@lingui/macro';
import Image from 'next/image';

interface LockTypeDrawerProps {
  onCancel: () => void;
}

const LockTypeDrawer: React.FC<LockTypeDrawerProps> = ({
  onCancel,
}: LockTypeDrawerProps) => {
  const { closeDrawer } = useDrawer(DrawerIds.LOCK_TYPE_DRAWER_ID);
  const { openFakePage } = useFakePage();

  const onOpenLockConfig = (
    lockMethod: ListLockMethod.PASSWORD | ListLockMethod.QUESTION
  ) => {
    closeDrawer();
    openFakePage('lockConfig', { lockMethod });
  };

  const drawerContent = (
    <div className="flex flex-col gap-6 pb-14">
      <div className="-mx-4 flex items-center gap-1 border-b pb-2 text-h2 font-bold text-black-text-01">
        <div
          onClick={() => {
            closeDrawer();
            onCancel();
          }}
          className="flex h-10 w-10 items-center justify-center"
        >
          <IconLeftArrowThin width={7.5} height={15} />
        </div>
        <Trans>取消</Trans>
      </div>
      <div className="relative h-48">
        <Image
          src="/images/form/password_key.png"
          alt="password-lock-image"
          width={196}
          height={196}
          className="absolute left-1 top-0"
        />
        <Image
          src="/images/form/question_coin.png"
          alt="question-lock-image"
          width={180}
          height={180}
          className="absolute left-36 top-0"
        />
      </div>
      <div className="flex flex-col text-xl font-bold text-black-text-01">
        <div>
          <Trans>好東西，值得藏一手。</Trans>
        </div>
        <Trans>讓讀者解鎖你的私藏好料！</Trans>
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-t1 font-semibold text-black-text-01">
          選擇一個上鎖方式
        </div>
        <div
          onClick={() => onOpenLockConfig(ListLockMethod.PASSWORD)}
          data-testid="lock-type-password"
          className="flex rounded-2xl border border-black-text-01 bg-yellow-bright-01"
        >
          <div className="flex w-full items-center gap-3 p-4">
            <IconKey />
            <div className="flex grow flex-col gap-1 text-t1 text-black-text-01">
              <div className="font-semibold">密碼上鎖</div>
              <div className="">創造朋友圈或粉絲製作的專屬內容</div>
            </div>
            <IconLeftArrowThin className="rotate-180" width={7.5} height={15} />
          </div>
        </div>
        <div
          onClick={() => onOpenLockConfig(ListLockMethod.QUESTION)}
          data-testid="lock-type-question"
          className="flex rounded-2xl border border-black-text-01 bg-yellow-bright-01"
        >
          <div className="flex w-full items-center gap-3 p-4">
            <IconCoin />
            <div className="flex grow flex-col gap-1 text-t1 text-black-text-01">
              <div className="font-semibold">問答上鎖</div>
              <div className="">獲得讀者想法或 Email</div>
            </div>
            <IconLeftArrowThin className="rotate-180" width={7.5} height={15} />
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <DrawerComponent
      drawerId={DrawerIds.LOCK_TYPE_DRAWER_ID}
      content={drawerContent}
      isShowClose={false}
      onClose={onCancel}
    />
  );
};

export default LockTypeDrawer;
