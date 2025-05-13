import AlertComponent from '@/components/Alert';
import { LoginDrawer } from '@/components/Drawer/LoginDrawer';
import { ErrorDrawer } from '@/components/ErrorDrawer';
import LoadingSpinner from '@/components/Loading';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import { LoginErrorDialog } from '@/pages/Home/Components/ErrorDialog';
import useCommonStore from '@/stores/useCommonStore';
import { useUIStore } from '@/stores/useUIStore';
import { User } from '@/types/User';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';

// 主要內容區域組件
const MainContent = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const navigateTo = useStrictNavigate();
  const {
    isLoading,
    setErrorDrawerMessage,
    isLoginDrawerOpen,
    setIsLoginDrawerOpen,
  } = useCommonStore();
  const { setScrollToTop } = useUIStore();
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollToTop(() => {
      mainContentRef.current?.scroll({ top: 0, behavior: 'smooth' });
    });
  }, [setScrollToTop]);

  const handleGoogleLogin = async (user: User) => {
    if (!user) {
      setIsLoginDrawerOpen(false);
      setErrorDrawerMessage({
        title: 'Login Error - Creator Account Not Found',
        content:
          'Only approved and verified “Creator Accounts” can log in and create lists. If you have any questions, please contact us.',
      });
      return;
    }
    setIsLoginDrawerOpen(false);
    navigateTo.user(user.userCode);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden sm:w-mobile-max sm:rounded-[20px] sm:border sm:border-black">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="fixed top-0 z-50 bg-white">
          <AlertComponent />
        </div>
        <div
          ref={mainContentRef}
          id="main-content"
          className="-mr-[3.8px] flex-1 overflow-x-hidden overflow-y-scroll bg-white"
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
          onError={() => setShowErrorDialog(true)}
        />
      </GoogleOAuthProvider>

      {/* FUTURE: Extract to a common component */}
      <LoginErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
      />
    </div>
  );
};

export default MainContent;
