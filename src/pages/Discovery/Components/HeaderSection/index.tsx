import { LoginDrawer } from '@/components/Drawer/LoginDrawer';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { ExternalLinks } from '@/constants/externalLink';
import useStrictNavigation from '@/hooks/useStrictNavigate';
import { openWindow } from '@/lib/openLink';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import '@/types/global';
import { User } from '@/types/User';
import { Trans } from '@lingui/react/macro';
import { useEffect, useState } from 'react';

export const HeaderSection = () => {
  const navigateTo = useStrictNavigation();
  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const [showCustomLogin, setShowCustomLogin] = useState(false);

  // Simplified login success handler, only responsible for closing login window
  const handleLoginSuccess = (user: User) => {
    setShowCustomLogin(false);
    // Use user data for navigation if needed
    if (user) {
      navigateTo.discovery();
    }
  };

  // Handle login error
  const handleLoginError = () => {
    setShowCustomLogin(false);
  };

  // Clean up Google account resources
  useEffect(() => {
    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [isLoggedIn]);

  const handleSignIn = () => {
    if (isLoggedIn && me?.userCode) {
      navigateTo.user(me.userCode);
    } else {
      setShowCustomLogin(true);
    }
  };

  return (
    <>
      <LoginDrawer
        isOpen={showCustomLogin}
        onClose={() => setShowCustomLogin(false)}
        onLogin={handleLoginSuccess}
        onError={handleLoginError}
      />

      <section className="flex flex-1 items-center justify-center bg-yellow-bright-01">
        <div className="flex w-full flex-col justify-center gap-6 px-6 pb-8 pt-6">
          <div className="flex flex-col items-center justify-center">
            <Trans>
              <h1 className="text-h1 font-bold text-black-text-01">
                My life in my lists
              </h1>
              <p className="text-t1 text-black-text-01">
                Invitation only. Ready to join?
              </p>
            </Trans>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant={ButtonVariant.BLACK}
              size={ButtonSize.MD}
              shape={ButtonShape.ROUNDED_8PX}
              onClick={() => openWindow(ExternalLinks.SIGNUP)}
            >
              <Trans>Create your account</Trans>
            </Button>
            <Button
              variant={ButtonVariant.WHITE}
              size={ButtonSize.MD}
              shape={ButtonShape.ROUNDED_8PX}
              onClick={handleSignIn}
            >
              <Trans>Sign in</Trans>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
