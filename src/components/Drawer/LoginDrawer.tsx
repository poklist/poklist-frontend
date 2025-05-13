import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ExternalLinks } from '@/constants/externalLink';
import axios from '@/lib/axios';
import { openWindow } from '@/lib/openLink';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { IResponse } from '@/types/response';
import { User } from '@/types/User';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';

export interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onError: () => void;
}
export interface LoginInfo {
  accessToken: string;
  user: User;
}

export const LoginDrawer = ({
  isOpen,
  onClose,
  onLogin,
  onError,
}: LoginDrawerProps) => {
  const { login } = useAuthStore();
  const { setMe } = useUserStore();
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
      onLogin(userData);
    } catch (error) {
      console.error('Google login failed:', error);
      onError();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        aria-describedby="login-drawer-description"
        className="bg-white px-0 py-0"
      >
        <div className="flex flex-col justify-center gap-6 px-[72px] pt-8">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              void handleGoogleLogin(credentialResponse);
            }}
            onError={onError}
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
                (i18n.locale === 'en' ? ' underline decoration-[#909090]' : '')
              }
              onClick={() => openWindow(ExternalLinks.TERMS)}
            >
              Terms of Service
            </span>
            ,{' '}
            <span
              className={
                'cursor-pointer text-black-text-01' +
                (i18n.locale === 'en' ? ' underline decoration-[#909090]' : '')
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
  );
};
