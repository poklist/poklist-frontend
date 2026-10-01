import phoneMobile from '@/assets/images/device-phone-mobile.png';
import { cn } from '@/lib/utils';
import useLayoutStore from '@/stores/useLayoutStore';
import { Trans } from '@lingui/macro';
import Image from 'next/image';

// 提示文字組件
const PromptText = () => {
  const { isMobile } = useLayoutStore();
  return (
    <div
      className={cn('hidden flex-row items-center gap-6 p-2', {
        'sm:flex': !isMobile,
      })}
    >
      <Image src={phoneMobile} alt="Device Phone Mobile" className="h-5" />
      <p className="text-start text-t1 font-bold text-black-text-01">
        <Trans>
          Relist 在手機畫面運作更順暢，使用行動裝置以取得更好的使用體驗。
        </Trans>
      </p>
    </div>
  );
};

export default PromptText;
