// FUTURE: merge with src/components/Header/index.tsx
import headerLogo from '@/assets/images/header-poklist.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import { LanguageToggleButton } from '@/lib/languageProvider';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/react/macro';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSignInClick: () => void;
}

const Header = ({ onSignInClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserStore();

  return (
    <header className="sticky top-4 z-50 w-full">
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

export default Header;
