import { DrawerComponent } from '@/components/Drawer';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { DrawerIds } from '@/constants/Drawer';
import { ExternalLinks } from '@/constants/externalLink';
import { openWindow } from '@/lib/openLink';
import { Trans } from '@lingui/macro';
import Image from 'next/image';

interface SignupDrawerProps {
  isCloseable?: boolean;
}

const SignupDrawer: React.FC = ({ isCloseable = false }: SignupDrawerProps) => {
  const drawerContent = (
    <div className="flex flex-col items-center gap-6 bg-green-bright-01 px-12 pb-6 pt-8">
      <Image
        src="/images/mascot/mascot-relist.svg"
        alt="Mascot with Relist"
        width={178}
        height={179}
        className="rotate-[-8deg]"
      />
      <div className="flex flex-col gap-4 text-center font-bold text-black-text-01">
        <h1 className="text-xl leading-none">
          <Trans>You’re good at this</Trans>
        </h1>
        <h2 className="text-h2 leading-normal">
          <Trans>Sign up to unlock more</Trans>
        </h2>
      </div>
      <Button
        onClick={() => openWindow(ExternalLinks.SIGNUP)}
        variant={ButtonVariant.BLACK}
        size={ButtonSize.LG}
        shape={ButtonShape.ROUNDED_FULL}
      >
        <Trans>Sign Up</Trans>
      </Button>
    </div>
  );
  return (
    <DrawerComponent
      className="border-none p-0"
      drawerId={DrawerIds.SIGNUP_DRAWER_ID}
      content={drawerContent}
      isShowClose={false}
      isCloseable={isCloseable}
    />
  );
};

export default SignupDrawer;
