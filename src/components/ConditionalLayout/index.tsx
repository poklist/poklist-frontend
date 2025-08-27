'use client';

import { StaticRoutes } from '@/constants/routes';
import useCheckStorage from '@/hooks/useCheckStorage';
import useIsMobile from '@/hooks/useIsMobile';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import useLayoutStore from '@/stores/useLayoutStore';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// 桌面版樣式包裹組件
import Background from '@/app/_layout/_components/Background';
import BottomNav from '@/app/_layout/_components/BottomNav';
import PromptText from '@/app/_layout/_components/PromptText';
import { cn } from '@/lib/utils';
interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const navigateTo = useStrictNavigateNext();
  const { isMobile } = useLayoutStore();
  const pathname = usePathname();

  useIsMobile();
  useCheckStorage();

  useEffect(() => {
    setIsMounted(true); // 確保 hydration 後才開始依賴 client 狀態
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent || ''
      );

    const redirectWhiteList = [
      StaticRoutes.ERROR,
      StaticRoutes.GO_TO_MOBILE,
    ] as string[];

    if (!isMobileDevice && !redirectWhiteList.includes(pathname)) {
      navigateTo.goToMobile();
    }
  }, [pathname, navigateTo, isMounted]);

  if (!isMounted) {
    // 避免伺服端和 client 初始輸出不一致
    return null; // 或者 return <div className="h-screen bg-white" />
  }

  const isGoToMobilePage = pathname === StaticRoutes.GO_TO_MOBILE;

  if (isGoToMobilePage) {
    return (
      <>
        <Background />
        <div className="flex flex-col items-center justify-center">
          <div
            className={cn('flex max-h-screen w-full flex-col', {
              'sm:w-mobile-max': !isMobile,
            })}
          >
            <PromptText />
            <div
              className={cn('relative h-screen w-full overflow-hidden', {
                'sm:w-mobile-max sm:rounded-[20px] sm:border sm:border-black':
                  !isMobile,
              })}
            >
              <div className="flex h-full flex-col overflow-hidden">
                <div className="flex-1 overflow-x-hidden overflow-y-scroll bg-white">
                  {children}
                </div>
              </div>
            </div>
            <BottomNav />
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
