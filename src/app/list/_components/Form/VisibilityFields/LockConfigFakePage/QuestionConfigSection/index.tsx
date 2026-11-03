import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LOCK_QUESTION_MAX_LENGTH } from '@/constants/form';
import { t, Trans } from '@lingui/macro';
import Image from 'next/image';

interface QuestionConfigSectionProps {
  isEdit: boolean;
  value: string;
  onChange: (value: string) => void;
}

const QuestionConfigSection = ({
  isEdit,
  value,
  onChange,
}: QuestionConfigSectionProps) => {
  // FUTURE: 編輯時改用 API 的回覆數（階段 5）；建立時尚無回覆
  const count = isEdit ? 23 : 0;
  const unread = isEdit ? 2 : 0;
  // 與驗證一致：去掉首尾空白後以 code point 計算
  const length = [...value.trim()].length;
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
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t`例如：分享一件最近讓你煩惱的小事`}
          data-testid="lock-question-input"
          className="h-[3.375rem] rounded-xl border border-black-text-01 text-t1"
        />
        <div
          data-testid="lock-question-count"
          className="self-end text-t2 text-black-gray-03"
        >
          {length}/{LOCK_QUESTION_MAX_LENGTH}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-t1 font-semibold text-black-text-01">
          <Trans>共 {count} 則回覆</Trans>
          <div className="">
            <Trans>{unread} 則未讀</Trans>
          </div>
        </div>
        <Button
          disabled={!isEdit}
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
