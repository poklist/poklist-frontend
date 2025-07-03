'use client';

import { StaticRoutes } from '@/constants/routes';
import useCheckStorage from '@/hooks/useCheckStorage';
import useIsMobile from '@/hooks/useIsMobile';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import useLayoutStore from '@/stores/useLayoutStore';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

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
  const navigateTo = useStrictNavigateNext();
  const { isMobile } = useLayoutStore();
  const pathname = usePathname();

  // 初始化移動設備檢測
  useIsMobile();
  useCheckStorage();

  // 檢查是否需要重定向到 GoToMobile
  useEffect(() => {
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent || ''
      );

    // 白名單：不需要重定向的頁面
    const redirectWhiteList = [
      StaticRoutes.ERROR,
      StaticRoutes.GO_TO_MOBILE,
    ] as string[];

    if (!isMobileDevice && !redirectWhiteList.includes(pathname)) {
      navigateTo.goToMobile();
    }
  }, [pathname, navigateTo]);

  // 判斷是否為 GoToMobile 頁面
  const isGoToMobilePage = pathname === StaticRoutes.GO_TO_MOBILE;

  // 如果是 GoToMobile 頁面，使用桌面版樣式包裹
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

  // 其他頁面直接渲染，不包裹桌面版樣式
  return <>{children}</>;
}
