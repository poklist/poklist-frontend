import { ExternalLinks } from '@/constants/externalLink';
import { cn } from '@/lib/utils';
import useLayoutStore from '@/stores/useLayoutStore';
import { Trans } from '@lingui/react/macro';

// 底部導航組件
const BottomNav = () => {
  const { isMobile } = useLayoutStore();
  return (
    <div
      className={cn(
        'text-tl hidden flex-row justify-center space-x-2 self-end py-2 font-bold text-black-text-01',
        {
          'sm:flex': !isMobile,
        }
      )}
    >
      <a href={ExternalLinks.ABOUT} target="_blank" rel="noreferrer">
        <Trans>About</Trans>
      </a>
      <span>|</span>
      <a href={ExternalLinks.TERMS} target="_blank" rel="noreferrer">
        <Trans>Terms</Trans>
      </a>
      <span>|</span>
      <a href={ExternalLinks.PRIVACY} target="_blank" rel="noreferrer">
        <Trans>Privacy</Trans>
      </a>
    </div>
  );
};

export default BottomNav;
