import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import { ExternalLinks } from '@/constants/externalLink';
import useAuthStore from '@/stores/useAuthStore';
import { Trans } from '@lingui/macro';

const IntroSection: React.FC = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div id="intro-to-relist" className="flex flex-col gap-6 px-4 pt-6 text-t1">
      <p>
        <strong>
          <Trans>歡迎來到 Relist！</Trans>
        </strong>
      </p>
      {isLoggedIn ? (
        <>
          <p>
            <Trans>
              這裡是你分享想法、建立口袋名單的地方。歡迎與我們分享你的使用經驗，讓我們一起把
              Relist 做得更棒！
            </Trans>
          </p>
          <a
            href={ExternalLinks.FEATURE_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit self-end"
          >
            <Button variant={ButtonVariant.BLACK} size={ButtonSize.SM}>
              <Trans>分享你的意見</Trans>
            </Button>
          </a>
        </>
      ) : (
        <>
          <p>
            <Trans>
              這裡是你分享想法、建立口袋名單的地方。目前我們正開放 Beta
              測試，誠摯邀請創作者來試用，歡迎申請！
            </Trans>
          </p>
          <a
            href={ExternalLinks.SIGNUP}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit self-end"
          >
            <Button variant={ButtonVariant.BLACK} size={ButtonSize.SM}>
              <Trans>立即申請</Trans>
            </Button>
          </a>
        </>
      )}
    </div>
  );
};

export default IntroSection;
