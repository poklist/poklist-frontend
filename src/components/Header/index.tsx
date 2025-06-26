import logoRelist from '@/assets/images/logo-relist.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import IconSetting from '@/components/ui/icons/SettingIcon';
import useStrictNavigation from '@/hooks/useStrictNavigate';
import { cn } from '@/lib/utils';
import { UserRouteLayoutContextType } from '@/pages/Layout/UserRouteLayout';
import { StaticRoutes } from '@/router';
import useAuthStore from '@/stores/useAuthStore';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';

const ColorMap = {
  white: 'bg-white',
  primary: 'bg-yellow-bright-01',
  transparent: 'bg-transparent',
};

export type HeaderBackgroundColor = keyof typeof ColorMap;

export interface HeaderProps {
  bgColor?: HeaderBackgroundColor;
  fakeBlockColor?: HeaderBackgroundColor;
  fakeBlock?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  className,
  bgColor = 'white',
  fakeBlockColor = 'transparent',
  fakeBlock = true,
}) => {
  const navigateTo = useStrictNavigation();

  // NOTE: This is a workaround to prevent the userCode from being null
  const outletContext = useOutletContext<UserRouteLayoutContextType | null>();
  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const { setIsLoginDrawerOpen } = useCommonStore();

  const isHomePage = useLocation().pathname === StaticRoutes.HOME;
  const isMyPage = outletContext?.userCode === me.userCode; // NOTE: to trim leading '@' sign

  const handleClickSignIn = () => {
    setIsLoginDrawerOpen(true);
  };

  const handleClickLogo = () => {
    // 清除 discovery 頁面的滾動位置紀錄
    sessionStorage.removeItem('scroll_pos_/discovery');
    if (isHomePage) {
      navigateTo.refresh();
    } else {
      navigateTo.home();
    }
  };

  return (
    <>
      <header
        id="relist-header"
        className={cn(
          'fixed top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between px-4 text-t1 font-semibold sm:sticky',
          ColorMap[bgColor],
          className
        )}
      >
        <div
          id="header-left"
          className="flex items-center justify-center gap-4"
        >
          <img
            src={logoRelist}
            alt="Relist"
            onClick={handleClickLogo}
            className="h-8"
          />
        </div>
        <div
          id="header-right"
          className="flex items-center justify-center gap-4"
        >
          {/* FUTURE: extract these logic to props for D in the SOLID principle */}
          {!isLoggedIn && (
            <Button
              size={ButtonSize.SM}
              variant={ButtonVariant.WHITE}
              onClick={handleClickSignIn}
            >
              Sign In
            </Button>
          )}
          {isLoggedIn && !isMyPage && (
            <Avatar
              className="h-8 w-8 cursor-pointer"
              onClick={() => navigateTo.user(me.userCode)}
            >
              <AvatarImage src={me.profileImage} />
              <AvatarFallback>{me.displayName[0]}</AvatarFallback>
            </Avatar>
          )}
          {(!isLoggedIn || (isLoggedIn && isMyPage)) && (
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
      {fakeBlock && (
        <div className={cn('h-14 sm:hidden', ColorMap[fakeBlockColor])} />
      )}
    </>
  );
};

export default Header;
