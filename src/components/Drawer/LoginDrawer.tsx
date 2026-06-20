'use client';

import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ExternalLinks } from '@/constants/externalLink';
import { useLogin } from '@/hooks/useLogin';
import { openWindow } from '@/lib/openLink';
import useCommonStore from '@/stores/useCommonStore';
import { User } from '@/types/User';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/macro';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export interface LoginInfo {
  accessToken: string;
  user: User;
}

/**
 * 登入抽屜組件
 *
 * 這個組件會被放在應用的最高層級，確保在整個應用中都能訪問到登入抽屜。
 * 它會監聽 useCommonStore 中的 isLoginDrawerOpen 狀態，
 * 當任何地方調用 setIsLoginDrawerOpen(true) 時，都會顯示登入抽屜。
 */
export const LoginDrawer = () => {
  const { isLoginDrawerOpen, setIsLoginDrawerOpen } = useCommonStore();
  const { handleLogin, handleLoginError } = useLogin();
  const [buttonWidth, setButtonWidth] = useState(376);

  useEffect(() => {
    const updateWidth = () => {
      setButtonWidth(window.innerWidth - 144);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleClose = () => {
    setIsLoginDrawerOpen(false);
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Drawer open={isLoginDrawerOpen} onOpenChange={handleClose}>
        <DrawerContent
          aria-describedby={undefined}
          className="border-none bg-transparent px-0 py-0"
        >
          <div className="relative bg-transparent">
            <Image
              src="/images/mascot/mascot-phone.svg"
              alt="Mascot Phone"
              width={152}
              height={137}
              className="mx-auto"
            />
            <Image
              src="/images/login/thought-bubble.svg"
              alt="Thought Bubble"
              width={282}
              height={175}
              className="absolute inset-x-0 top-6 -z-10 mx-auto"
            />
          </div>
          <div className="flex flex-col justify-center gap-6 border-t border-t-black bg-yellow-bright-01 pt-8">
            <div className="text-center text-xl font-bold text-black-text-01">
              <Trans>Let’s jump in</Trans>
            </div>
            <div className="mx-[4.5rem] mb-0.5 rounded-full ring-1 ring-black max-w-[25rem]">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  void handleLogin(credentialResponse);
                }}
                onError={handleLoginError}
                useOneTap={false}
                type="standard"
                theme="outline"
                size="large"
                text="signin_with"
                shape="pill"
                width={buttonWidth.toString()}
              />
            </div>
          </div>
          <div className="bg-yellow-bright-01 px-14 py-6 text-center text-[13px] text-black-text-01">
            <Trans>
              By continuing, you agree to our{' '}
              <span
                className={
                  'cursor-pointer text-black-text-01' +
                  (i18n.locale === 'en'
                    ? ' underline decoration-[#909090]'
                    : '')
                }
                onClick={() => openWindow(ExternalLinks.TERMS)}
              >
                Terms of Service
              </span>
              ,{' '}
              <span
                className={
                  'cursor-pointer text-black-text-01' +
                  (i18n.locale === 'en'
                    ? ' underline decoration-[#909090]'
                    : '')
                }
                onClick={() => openWindow(ExternalLinks.PRIVACY)}
              >
                Privacy Policy
              </span>
              . You confirm you&apos;re 13+.
            </Trans>
          </div>
        </DrawerContent>
      </Drawer>
    </GoogleOAuthProvider>
  );
};
