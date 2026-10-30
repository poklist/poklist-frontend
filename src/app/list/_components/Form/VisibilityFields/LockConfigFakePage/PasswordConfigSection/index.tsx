import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import IconCopy from '@/components/ui/icons/CopyIcon';
import { MessageType } from '@/enums/Style/index.enum';
import useClipboard from '@/hooks/useClipboard';
import { toast } from '@/hooks/useToast';
import { t, Trans } from '@lingui/macro';
import Image from 'next/image';

const PasswordConfigSection = () => {
  const { copy } = useClipboard();

  const password = 'relist13142';
  const unlocked = 19;
  const limit = 20;

  const onCopy = async () => {
    await copy(password);
    toast({
      title: t`已複製到剪貼簿`,
      variant: MessageType.SUCCESS,
    });
  };
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-black-text-01 bg-yellow-bright-01 px-4 py-8">
      <div className="flex justify-between">
        <Image
          src="/images/form/password_key.png"
          alt="password-lock-image"
          width={80}
          height={80}
          className="max-h-20 min-h-20 min-w-20 max-w-20"
        />
        <div className="flex flex-col gap-2 text-t1 text-black-text-01">
          <div className="text-xl font-bold">
            <Trans>密碼上鎖</Trans>
          </div>
          <div className="font-semibold">
            <Trans>讀者輸入密碼，解鎖完整名單。</Trans>
          </div>
          <Trans>創造朋友圈或粉絲製作專屬內容</Trans>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-black-text-01 px-4 py-3">
        <div className="flex gap-2.5 text-t1 font-semibold text-black-tint-04">
          <Trans>密碼</Trans>
          <div className="text-yellow-bright-01">{password}</div>
        </div>
        <IconCopy
          onClick={() => void onCopy()}
          width={16.5}
          height={16.5}
          className="text-white"
        />
      </div>
      <div className="flex flex-col gap-2 text-t2 text-black-text-01">
        <div className="text-t1 font-semibold">
          <Trans>解鎖名額</Trans>
        </div>
        <Trans>
          最多 10 位使用者可使用此密碼解鎖完整名單；額滿後可再增加名額。
        </Trans>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-t1 font-semibold text-black-text-01">
          <Trans>
            {unlocked}/{limit} 人已解鎖
          </Trans>
          <div className="">
            <Trans>剩餘 {limit - unlocked} 個名額</Trans>
          </div>
        </div>
        <Button
          disabled={limit - unlocked > 0}
          variant={ButtonVariant.SMART_PURPLE}
          size={ButtonSize.H40}
          shape={ButtonShape.ROUNDED_8PX}
          className="font-semibold disabled:border-gray-note-05 disabled:bg-gray-note-05 disabled:text-black-tint-04"
        >
          <Trans>新增 10 個名額</Trans>
        </Button>
      </div>
    </div>
  );
};

export default PasswordConfigSection;
