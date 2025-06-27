import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { ExternalLinks } from '@/constants/externalLink';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { openWindow } from '@/lib/openLink';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import useCommonStore from '@/stores/useCommonStore';
import '@/types/global';
import { Trans } from '@lingui/react/macro';
import { useEffect } from 'react';

export const HeaderSection = () => {
  const navigateTo = useStrictNavigationAdapter();
  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const { setIsLoginDrawerOpen } = useCommonStore();

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
      // 使用全域 LoginDrawer 而不是本地狀態
      setIsLoginDrawerOpen(true);
    }
  };

  return (
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
  );
};
