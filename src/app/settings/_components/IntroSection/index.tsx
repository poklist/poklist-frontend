import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import { Trans } from '@lingui/react/macro';

const IntroSection: React.FC = () => {
  return (
    <div
      id="intro-to-relist"
      className="flex flex-col gap-6 px-4 pt-6 text-[15px]"
    >
      <p>
        <strong>
          <Trans>Welcome to the Relist community!</Trans>
        </strong>
      </p>
      <p>
        <Trans>
          This is your space to drop ideas and build your pocket list. Tell us
          what you think and how it feels. Your voice helps shape what comes
          next.
        </Trans>
      </p>
      <a
        href="https://relist.featurebase.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit self-end"
      >
        <Button variant={ButtonVariant.BLACK} size={ButtonSize.SM}>
          <Trans>Tell us what you think</Trans>
        </Button>
      </a>
    </div>
  );
};

export default IntroSection;
