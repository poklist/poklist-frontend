'use client';

import logoRelist from '@/assets/images/logo-relist.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import IconSetting from '@/components/ui/icons/SettingIcon';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { cn } from '@/lib/utils';
import { UserRouteLayoutContextType } from '@/hooks/useUserRouteContext';
import { StaticRoutes } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';
import { usePathname } from 'next/navigation';
import { LanguageToggleButton } from '../Language';

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
  const navigateTo = useStrictNavigateNext();

  // NOTE: This is a workaround to prevent the userCode from being null
  let outletContext: UserRouteLayoutContextType | null = null;
  try {
    // 在App Router環境中，這個會失敗
    outletContext = useUserRouteContext();
  } catch {
    // 在App Router環境中，我們暫時不使用outlet context
    outletContext = null;
  }

  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const { setIsLoginDrawerOpen } = useCommonStore();

  // 使用Next.js的usePathname替代React Router的useLocation
  let pathname = '/';
  try {
    pathname = usePathname() || '/';
  } catch {
    // 如果在React Router環境中，fallback到空字符串
    pathname = '/';
  }

  const isHomePage = pathname === StaticRoutes.HOME;
  const isDiscoveryPage = pathname === StaticRoutes.DISCOVERY;
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
            src={logoRelist.src}
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
          {isDiscoveryPage && <LanguageToggleButton />}
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
              <AvatarImage src={me.profileImage || undefined} />
              <AvatarFallback>{me.displayName[0]}</AvatarFallback>
            </Avatar>
          )}
          {!isDiscoveryPage && (!isLoggedIn || (isLoggedIn && isMyPage)) && (
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
