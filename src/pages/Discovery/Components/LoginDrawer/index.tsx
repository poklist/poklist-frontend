import { LoginDrawerProps, LoginInfo } from '@/types/Discovery';
import { Trans } from '@lingui/react/macro';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from '@/lib/axios';
import { IResponse } from '@/types/response';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { useEffect, useState } from 'react';

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

      // callback to notify parent component of successful login and pass user ID
      onLogin(true);
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
            onClick={() => {}}
          >
            <Trans>New to Relist? Get started!</Trans>
          </Button>
        </div>
        <div className="px-[50px] pb-8 pt-6 text-center text-sm text-[#909090]">
          <Trans>By continuing, you agree to our</Trans>
          <a href="#" target="_blank" className="text-black-text-01">
            <Trans>Terms of Service</Trans>
          </a>
          <Trans>,</Trans>
          <a href="#" target="_blank" className="text-black-text-01">
            <Trans>Privacy Policy.</Trans>
          </a>
          <Trans>You confirm you&apos;re 13+.</Trans>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
