import phoneMobile from '@/assets/images/device-phone-mobile.png';
import { cn } from '@/lib/utils';
import useLayoutStore from '@/stores/useLayoutStore';
import { Trans } from '@lingui/react/macro';

// 提示文字組件
const PromptText = () => {
  const { isMobile } = useLayoutStore();
  return (
    <div
      className={cn('hidden flex-row items-center gap-6 p-2', {
        'sm:flex': !isMobile,
      })}
    >
      <img src={phoneMobile} alt="Device Phone Mobile" className="h-5" />
      <p className="text-start text-t1 font-bold text-black-text-01">
        <Trans>
          Relist works best on mobile. Use a mobile device for the best
          experience.
        </Trans>
      </p>
    </div>
  );
};

export default PromptText;
