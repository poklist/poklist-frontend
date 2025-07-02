'use client';

import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ExternalLinks } from '@/constants/externalLink';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import axios from '@/lib/axios';
import { openWindow } from '@/lib/openLink';
import useAuthStore from '@/stores/useAuthStore';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IResponse } from '@/types/response';
import { User } from '@/types/User';
import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from '@react-oauth/google';
import { useEffect, useState } from 'react';

interface LoginInfo {
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
  const { isLoginDrawerOpen, setIsLoginDrawerOpen, setErrorDrawerMessage } =
    useCommonStore();
  const { login } = useAuthStore();
  const { setMe } = useUserStore();
  const navigateTo = useStrictNavigateNext();
  const [buttonWidth, setButtonWidth] = useState(376);

  useEffect(() => {
    const updateWidth = () => {
      setButtonWidth(window.innerWidth - 144);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleGoogleLogin = async (response: CredentialResponse) => {
    try {
      const res = await axios.post<IResponse<LoginInfo>>('/auth/google', {
        idToken: response.credential,
      });
      if (!res.data.content?.accessToken) {
        throw new Error('No access token');
      }
      login(res.data.content?.accessToken);
      const userData = res.data.content?.user;
      setMe(userData);
      setIsLoginDrawerOpen(false);
      navigateTo.discovery();
    } catch (error) {
      console.error('Google login failed:', error);
      handleLoginError();
    }
  };

  const handleLoginError = () => {
    setIsLoginDrawerOpen(false);
    setErrorDrawerMessage({
      title: t`Right now, only invited users can log in`,
      content: t`Already got your invite? Jump in and apply now!`,
    });
  };

  const handleClose = () => {
    setIsLoginDrawerOpen(false);
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Drawer open={isLoginDrawerOpen} onOpenChange={handleClose}>
        <DrawerContent
          aria-describedby="login-drawer-description"
          className="bg-white px-0 py-0"
        >
          <div className="flex flex-col justify-center gap-6 px-[72px] pt-8">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                void handleGoogleLogin(credentialResponse);
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
            <Button
              variant={ButtonVariant.BLACK}
              size={ButtonSize.LG}
              shape={ButtonShape.ROUNDED_FULL}
              onClick={() => openWindow(ExternalLinks.SIGNUP)}
            >
              <Trans>New to Relist? Get started!</Trans>
            </Button>
          </div>
          <div className="px-[50px] pb-8 pt-6 text-center text-[13px] text-[#909090]">
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
