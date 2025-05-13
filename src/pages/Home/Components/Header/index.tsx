// FUTURE: merge with src/components/Header/index.tsx
import headerLogo from '@/assets/images/header-poklist.svg';
import { LanguageToggleButton } from '@/components/Language';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import useCommonStore from '@/stores/useCommonStore';
import { useUIStore } from '@/stores/useUIStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/react/macro';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const navigateTo = useStrictNavigate();
  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const { setIsLoginDrawerOpen } = useCommonStore();
  const { scrollToTop } = useUIStore();
  const handleSignIn = () => {
    setIsLoginDrawerOpen(true);
  };

  return (
    <>
      <header
        id="home-header"
        className={cn('sticky top-0 z-50 w-full', className)}
      >
        <div className="flex h-14 w-full items-center justify-between px-4">
          <img
            src={headerLogo}
            alt="Poklist"
            className="h-8"
            onClick={scrollToTop}
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
