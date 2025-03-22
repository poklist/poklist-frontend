// FUTURE: merge with src/components/Header/index.tsx
import headerLogo from '@/assets/images/header-poklist.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import axios from '@/lib/axios';
import { LanguageToggleButton } from '@/lib/languageProvider';
import useUserStore from '@/stores/useUserStore';
import { LoginInfo } from '@/types/Home';
import { IResponse } from '@/types/response';
import { Trans } from '@lingui/react/macro';
import { CredentialResponse } from '@react-oauth/google';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginDrawer } from '../LoginDrawer';
import { ErrorDialog } from '../ErrorDialog';

const Header = () => {
  const navigate = useNavigate();
  const { login, setUser, user, isLoggedIn } = useUserStore();
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
      setUser(userData);
      setShowCustomLogin(false);
      navigate(`/${userData.userCode}`);
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

      <header className="sticky top-0 z-50 w-full">
        <div className="flex h-14 w-full items-center justify-between px-4">
          <Link to="/home">
            <img src={headerLogo} alt="Poklist" className="h-8" />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageToggleButton />
            {isLoggedIn ? (
              <Avatar
                className="h-8 w-8 cursor-pointer"
                onClick={() => navigate(`/${user.userCode}`)}
              >
                <AvatarImage src={user.profileImage} />
                <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
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
