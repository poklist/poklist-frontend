import AlertComponent from '@/components/Alert';
import { LoginDrawer } from '@/components/Drawer/LoginDrawer';
import { ErrorDrawer } from '@/components/ErrorDrawer';
import LoadingSpinner from '@/components/Loading';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import useStrictNavigation from '@/hooks/useStrictNavigate';
import { cn } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import useLayoutStore from '@/stores/useLayoutStore';
import { useUIStore } from '@/stores/useUIStore';
import { User } from '@/types/User';
import { t } from '@lingui/core/macro';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// 主要內容區域組件
const MainContent = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  const { isMobile } = useLayoutStore();

  const navigateTo = useStrictNavigation();
  const {
    isLoading,
    isLoginDrawerOpen,
    setIsLoginDrawerOpen,
    setErrorDrawerMessage,
  } = useCommonStore();
  const { setScrollToTop } = useUIStore();
  const isHomePage = useLocation().pathname === '/discovery';

  const mainContentRef = useRef<HTMLDivElement>(null);
  // 使用自定義 hook 管理滾動位置
  useScrollPosition(mainContentRef, {
    restoreDelay: 0, // 可以調整延遲時間
  });

  useEffect(() => {
    setScrollToTop(() => {
      mainContentRef.current?.scroll({ top: 0, behavior: 'smooth' });
    });
  }, [setScrollToTop]);

  const handleGoogleLogin = (user: User) => {
    if (!user) {
      setIsLoginDrawerOpen(false);
      handleLoginError();
      return;
    }
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

  return (
    <div
      className={cn('relative h-screen w-full overflow-hidden', {
        'sm:w-mobile-max sm:rounded-[20px] sm:border sm:border-black':
          !isMobile,
      })}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="fixed top-0 z-50 bg-white">
          <AlertComponent />
        </div>
        <div
          ref={mainContentRef}
          id="main-content"
          className={cn(
            '-mr-[3.8px] flex-1 overflow-x-hidden overflow-y-scroll bg-white',
            {
              'bg-yellow-bright-01': isHomePage,
            }
          )}
        >
          <Outlet />
        </div>
      </div>

      <LoadingSpinner isLoading={isLoading} />
      <ErrorDrawer />

      <GoogleOAuthProvider clientId={clientId}>
        <LoginDrawer
          isOpen={isLoginDrawerOpen}
          onClose={() => setIsLoginDrawerOpen(false)}
          onLogin={handleGoogleLogin}
          onError={handleLoginError}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default MainContent;
