import { Trans } from '@lingui/react/macro';

// 底部導航組件
const BottomNav = () => {
  return (
    <div className="text-tl hidden flex-row justify-center space-x-2 self-end py-2 font-bold text-black-text-01 sm:flex">
      <a
        href="https://opaque-creek-8e5.notion.site/Poklist-About-Poklist-1a8a4cd4b98b80868769d3f690d094ab"
        target="_blank"
        rel="noreferrer"
      >
        <Trans>About</Trans>
      </a>
      <span>|</span>
      <a
        href="https://opaque-creek-8e5.notion.site/Terms-of-Service-1a9a4cd4b98b80ebb5cee016b5c88089"
        target="_blank"
        rel="noreferrer"
      >
        <Trans>Terms</Trans>
      </a>
      <span>|</span>
      <a
        href="https://opaque-creek-8e5.notion.site/Privacy-Policy-1a9a4cd4b98b8098a2c4fa29619981dc"
        target="_blank"
        rel="noreferrer"
      >
        <Trans>Privacy</Trans>
      </a>
    </div>
  );
};

export default BottomNav;
