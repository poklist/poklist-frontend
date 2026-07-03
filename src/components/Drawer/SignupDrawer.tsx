import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { DrawerIds } from '@/constants/Drawer';
import { ExternalLinks } from '@/constants/externalLink';
import { openWindow } from '@/lib/openLink';
import { i18n, MessageDescriptor } from '@lingui/core';
import { msg, Trans } from '@lingui/macro';
import Image from 'next/image';
import { useRef } from 'react';

export enum SignupDrawerVariant {
  LIST_FULL = 'LIST_FULL',
  IDEA_FULL = 'IDEA_FULL',
  ALL_FULL = 'ALL_FULL',
}

interface SignupVariantConfig {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  title: MessageDescriptor;
  subtitle: MessageDescriptor;
}

const DEFAULT_CONFIG: SignupVariantConfig = {
  src: '/images/mascot/mascot-relist.svg',
  width: 178,
  height: 179,
  className: 'rotate-[-8deg]',
  alt: 'Mascot with Relist',
  title: msg`You’re good at this`,
  subtitle: msg`Sign up to unlock more`,
};

const VARIANT_CONFIG: Record<SignupDrawerVariant, SignupVariantConfig> = {
  [SignupDrawerVariant.LIST_FULL]: {
    src: '/images/mascot/mascot-error.svg',
    width: 116,
    height: 144,
    alt: 'Mascot for list quota reached',
    title: msg`You’ve reached the list limit…`,
    subtitle: msg`Sign up free to unlock more`,
  },
  [SignupDrawerVariant.IDEA_FULL]: {
    src: '/images/mascot/mascot-fly.svg',
    width: 180,
    height: 144,
    alt: 'Mascot for idea quota reached',
    title: msg`This list is full…`,
    subtitle: msg`Choose another list, or sign up free to unlock more access. `,
  },
  [SignupDrawerVariant.ALL_FULL]: {
    src: '/images/mascot/mascot-love-eyes.svg',
    width: 127,
    height: 144,
    alt: 'Mascot for all quota reached',
    title: msg`Trial limit reached…`,
    subtitle: msg`Good taste deserves space. 
    Sign up free to unlock it. `,
  },
};

const isSignupDrawerVariant = (
  value: string | undefined
): value is SignupDrawerVariant =>
  Object.values(SignupDrawerVariant).includes(value as SignupDrawerVariant);

const SignupDrawer: React.FC = () => {
  const { options } = useDrawer(DrawerIds.SIGNUP_DRAWER_ID);
  const lastConfigRef = useRef(DEFAULT_CONFIG);

  if (options !== undefined) {
    lastConfigRef.current = isSignupDrawerVariant(options.variant)
      ? VARIANT_CONFIG[options.variant]
      : DEFAULT_CONFIG;
  }

  const config = lastConfigRef.current;

  const drawerContent = (
    <div className="flex flex-col items-center gap-6 bg-green-bright-01 px-12 pb-6 pt-8">
      <Image
        src={config.src}
        alt={config.alt}
        width={config.width}
        height={config.height}
        className={config.className ?? ''}
      />
      <div className="flex flex-col gap-4 text-center font-bold text-black-text-01">
        <h1 className="text-xl leading-none">{i18n._(config.title)}</h1>
        <h2 className="text-h2 leading-normal">{i18n._(config.subtitle)}</h2>
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
      isCloseable={options?.isCloseable}
    />
  );
};

export default SignupDrawer;
