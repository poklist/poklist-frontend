import headerPoklist from '@/assets/images/header-poklist.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import IconSetting from '@/components/ui/icons/SettingIcon';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import { cn } from '@/lib/utils';
import { UserRouteLayoutContextType } from '@/pages/Layout/UserRouteLayuout';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigateTo = useStrictNavigate();

  // NOTE: This is a workaround to prevent the userCode from being null
  const outletContext = useOutletContext<UserRouteLayoutContextType | null>();
  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const isMyPage = outletContext?.userCode === me.userCode;

  return (
    <>
      <header
        id="poklist-header"
        className={cn(
          'fixed top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between bg-white px-4 text-t1 font-semibold sm:sticky',
          className
        )}
      >
        <div
          id="header-left"
          className="flex items-center justify-center gap-4"
        >
          <Link to="/discovery" reloadDocument>
            <img
              src={headerPoklist}
              alt="Poklist"
              className="h-8 cursor-pointer"
            />
          </Link>
        </div>
        <div
          id="header-right"
          className="flex items-center justify-center gap-4"
        >
          {!isLoggedIn && (
            <Button
              variant={ButtonVariant.WHITE}
              onClick={() => navigateTo.home()}
            >
              Sign In
            </Button>
          )}
          {isLoggedIn && !isMyPage ? (
            <Avatar
              className="h-8 w-8 cursor-pointer"
              onClick={() => navigateTo.user(me.userCode)}
            >
              <AvatarImage src={me.profileImage} />
              <AvatarFallback>{me.displayName[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <Button
              variant={ButtonVariant.WHITE}
              size={ButtonSize.ICON}
              onClick={() => navigateTo.settings()}
            >
              <IconSetting />
            </Button>
          )}
        </div>
      </header>
      <div className="h-14 sm:hidden" />
    </>
  );
};

export default Header;
