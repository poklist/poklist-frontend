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
      setButtonWidth(window.innerWidth - 56);
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
      <DrawerContent className="rounded-t-lg bg-white px-0 py-0">
        <div className="flex flex-col justify-center gap-5 px-7 pt-9">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              void handleGoogleLogin(credentialResponse);
            }}
            onError={onError}
            useOneTap={false}
            type="standard"
            theme="filled_black"
            size="large"
            text="signin_with"
            shape="rectangular"
            width={buttonWidth.toString()}
          />
          <Button
            variant={ButtonVariant.WHITE}
            size={ButtonSize.LG}
            shape={ButtonShape.ROUNDED_8PX}
            onClick={() => {}}
          >
            <Trans>首次使用Relist？立即申請</Trans>
          </Button>
        </div>
        <div className="px-12 py-8 text-center text-sm text-[#909090]">
          <Trans>登入或註冊時，表示你已閱讀並同意Relist</Trans>
          <a
            href="#"
            target="_blank"
            className="text-[#1989B9] hover:underline"
          >
            <Trans>資料使用條款</Trans>
          </a>
          <Trans>與</Trans>
          <a
            href="#"
            target="_blank"
            className="text-[#1989B9] hover:underline"
          >
            <Trans>服務使用條款</Trans>
          </a>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
