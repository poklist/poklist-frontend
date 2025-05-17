import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import { Trans } from '@lingui/react/macro';

const IntroSection: React.FC = () => {
  return (
    <div
      id="intro-to-relist"
      className="flex flex-col gap-6 px-4 pt-6 text-[15px]"
    >
      <p>
        <Trans>
          <strong>List Your World.</strong>
          <br />
          <br /> From secret coffee spots and must-have skincare, to
          binge-worthy shows and game-changing life hacks—create, explore, and
          share your top picks with the world.
        </Trans>
      </p>
      <p>
        <Trans>
          🚀 <strong>We’re in Beta</strong> and want you to be part of the
          journey! Join us, shape the platform, and help us reach the next
          level.
        </Trans>
      </p>
      <Button
        variant={ButtonVariant.BLACK}
        size={ButtonSize.SM}
        className="w-fit self-end"
      >
        <Trans>✨ Sign up now and start listing!</Trans>
      </Button>
    </div>
  );
};

export default IntroSection;
