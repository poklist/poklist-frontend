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
      <Button
        variant={ButtonVariant.BLACK}
        size={ButtonSize.SM}
        className="w-fit self-end"
      >
        <Trans>Tell us what you think</Trans>
      </Button>
    </div>
  );
};

export default IntroSection;
