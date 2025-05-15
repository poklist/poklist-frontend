import AlertComponent from '@/components/Alert';
import { LoginDrawer } from '@/components/Drawer/LoginDrawer';
import { ErrorDrawer } from '@/components/ErrorDrawer';
import LoadingSpinner from '@/components/Loading';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import { cn } from '@/lib/utils';
import { LoginErrorDialog } from '@/pages/Home/Components/LoginErrorDialog';
import useCommonStore from '@/stores/useCommonStore';
import useLayoutStore from '@/stores/useLayoutStore';
import { useUIStore } from '@/stores/useUIStore';
import { User } from '@/types/User';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// 主要內容區域組件
const MainContent = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const { isMobile } = useLayoutStore();

  const navigateTo = useStrictNavigate();
  const { isLoading, isLoginDrawerOpen, setIsLoginDrawerOpen } =
    useCommonStore();
  const { setScrollToTop } = useUIStore();
  const [isLoginErrorDialogOpen, setIsLoginErrorDialogOpen] = useState(false);
  const isHomePage = useLocation().pathname === '/home';

  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollToTop(() => {
      mainContentRef.current?.scroll({ top: 0, behavior: 'smooth' });
    });
  }, [setScrollToTop]);

  const handleGoogleLogin = async (user: User) => {
    if (!user) {
      setIsLoginDrawerOpen(false);
      handleLoginError();
      return;
    }
    setIsLoginDrawerOpen(false);
    navigateTo.user(user.userCode);
  };

  const handleLoginError = () => {
    setIsLoginDrawerOpen(false);
    setIsLoginErrorDialogOpen(true);
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

      <LoginErrorDialog
        open={isLoginErrorDialogOpen}
        onOpenChange={setIsLoginErrorDialogOpen}
        onClose={() => setIsLoginErrorDialogOpen(false)}
      />

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
