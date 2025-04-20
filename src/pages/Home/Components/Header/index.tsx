// FUTURE: merge with src/components/Header/index.tsx
import headerLogo from '@/assets/images/header-poklist.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import axios from '@/lib/axios';
import { LanguageToggleButton } from '@/lib/languageProvider';
import { cn } from '@/lib/utils';
import useUserStore from '@/stores/useUserStore';
import { LoginInfo } from '@/types/Home';
import { IResponse } from '@/types/response';
import { Trans } from '@lingui/react/macro';
import { CredentialResponse } from '@react-oauth/google';
import { useState } from 'react';
import { ErrorDialog } from '../ErrorDialog';
import { LoginDrawer } from '../LoginDrawer';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const navigateTo = useStrictNavigate();
  const { login, setMe, me, isLoggedIn } = useUserStore();
  const [showCustomLogin, setShowCustomLogin] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

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
      setShowCustomLogin(false);
      navigateTo.user(userData.userCode);
    } catch (error) {
      setShowCustomLogin(false);
      setShowErrorDialog(true);
    }
  };

  const handleSignIn = () => {
    setShowCustomLogin(true);
  };

  return (
    <>
      <LoginDrawer
        isOpen={showCustomLogin}
        onClose={() => setShowCustomLogin(false)}
        onLogin={handleGoogleLogin}
        onError={() => setShowErrorDialog(true)}
      />

      <ErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        onClose={() => setShowCustomLogin(false)}
      />

      <header
        id="home-header"
        className={cn('sticky top-0 z-50 w-full', className)}
      >
        <div className="flex h-14 w-full items-center justify-between px-4">
          <img
            src={headerLogo}
            alt="Poklist"
            className="h-8"
            onClick={() => navigateTo.home()}
          />
          <div className="flex items-center gap-4">
            <LanguageToggleButton />
            {isLoggedIn ? (
              <Avatar
                className="h-8 w-8 cursor-pointer"
                onClick={() => navigateTo.user(me.userCode)}
              >
                <AvatarImage src={me.profileImage} />
                <AvatarFallback>{me.displayName?.[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <Button
                variant={ButtonVariant.WHITE}
                size={ButtonSize.SM}
                className="font-semibold text-black hover:text-gray-700"
                onClick={handleSignIn}
              >
                <Trans>Sign In</Trans>
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
