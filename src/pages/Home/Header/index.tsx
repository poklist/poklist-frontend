import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import headerLogo from '@/assets/images/header-poklist.svg';
import { LanguageToggleButton } from '@/lib/languageProvider';
import useUserStore from '@/stores/useUserStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trans } from '@lingui/macro';

interface HeaderProps {
  onSignInClick: () => void;
}

export const Header = ({ onSignInClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserStore();

  return (
    <header className="fixed top-0 z-50 w-mobile-max">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4">
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
              variant="white"
              className="font-semibold text-black hover:text-gray-700"
              onClick={onSignInClick}
            >
              <Trans>Sign In</Trans>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
