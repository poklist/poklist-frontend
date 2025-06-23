'use client';

import { LoginDrawer } from '@/components/Drawer/LoginDrawer';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateAdapter';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { User } from '@/types/User';
import { t } from '@lingui/core/macro';
import { GoogleOAuthProvider } from '@react-oauth/google';

/**
 * 全域登入抽屜組件
 *
 * 這個組件會被放在應用的最高層級，確保在整個應用中都能訪問到登入抽屜。
 * 它會監聽 useCommonStore 中的 isLoginDrawerOpen 狀態，
 * 當任何地方調用 setIsLoginDrawerOpen(true) 時，都會顯示登入抽屜。
 */
export const LoginDrawerGlobal = () => {
  const { isLoginDrawerOpen, setIsLoginDrawerOpen, setErrorDrawerMessage } =
    useCommonStore();
  const { setMe } = useUserStore();
  const navigateTo = useStrictNavigationAdapter();

  const handleGoogleLogin = (user: User) => {
    if (!user) {
      setIsLoginDrawerOpen(false);
      handleLoginError();
      return;
    }
    setMe(user);
    setIsLoginDrawerOpen(false);
    navigateTo.discovery();
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
      <LoginDrawer
        isOpen={isLoginDrawerOpen}
        onClose={handleClose}
        onLogin={handleGoogleLogin}
        onError={handleLoginError}
      />
    </GoogleOAuthProvider>
  );
};
