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
  title: msg`哇，你很會開單耶！`,
  subtitle: msg`完成註冊，有機會獲得更多創作權限`,
};

const VARIANT_CONFIG: Record<SignupDrawerVariant, SignupVariantConfig> = {
  [SignupDrawerVariant.LIST_FULL]: {
    src: '/images/mascot/mascot-error.svg',
    width: 116,
    height: 144,
    alt: 'Mascot for list quota reached',
    title: msg`建立名單額度已滿…`,
    subtitle: msg`免費註冊，建立更多名單！`,
  },
  [SignupDrawerVariant.IDEA_FULL]: {
    src: '/images/mascot/mascot-fly.svg',
    width: 180,
    height: 144,
    alt: 'Mascot for idea quota reached',
    title: msg`此名單已滿了…`,
    subtitle: msg`完成註冊，有機會獲得更多創作權限`,
  },
  [SignupDrawerVariant.ALL_FULL]: {
    src: '/images/mascot/mascot-love-eyes.svg',
    width: 127,
    height: 144,
    alt: 'Mascot for all quota reached',
    title: msg`哇！體驗額度已用完…`,
    subtitle: msg`你的好名單，值得有更多空間。
免費註冊，享受更多創作！`,
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
        <Trans>立即註冊</Trans>
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
