import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t, Trans } from '@lingui/macro';
import Image from 'next/image';

const QuestionConfigSection = () => {
  const count = 23;
  const unread = 2;
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-black-text-01 bg-yellow-bright-01 px-4 py-8">
      <div className="flex justify-between">
        <Image
          src="/images/form/question_coin.png"
          alt="question-lock-image"
          width={80}
          height={80}
          className="max-h-20 min-h-20 min-w-20 max-w-20"
        />
        <div className="flex flex-col gap-2 text-t1 text-black-text-01">
          <div className="text-xl font-bold">
            <Trans>問題上鎖</Trans>
          </div>
          <div className="font-semibold">
            <Trans>讀者回答問題，解鎖完整名單</Trans>
          </div>
          <div className="flex flex-col">
            <div className="font-normal">
              <Trans>獲得讀者想法或 Email</Trans>
            </div>
            <Trans>問題設定可隨時修改</Trans>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Trans>問題設定：</Trans>
        <Input
          placeholder={t`例如：分享一件最近讓你煩惱的小事`}
          className="h-[3.375rem] rounded-xl border border-black-text-01 text-t1"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-t1 font-semibold text-black-text-01">
          <Trans>共 {count} 則回覆</Trans>
          <div className="">
            <Trans>{unread} 則未讀</Trans>
          </div>
        </div>
        <Button
          variant={ButtonVariant.BLACK}
          size={ButtonSize.H40}
          shape={ButtonShape.ROUNDED_8PX}
          className="font-semibold"
        >
          <Trans>回覆列表</Trans>
        </Button>
      </div>
    </div>
  );
};

export default QuestionConfigSection;
