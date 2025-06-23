// Provider imports removed - now handled by App Router layout
import useCheckStorage from '@/hooks/useCheckStorage';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateAdapter';
import { cn } from '@/lib/utils';
import { StaticRoutes } from '@/constants/routes';
import useLayoutStore from '@/stores/useLayoutStore';
import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Background from './Components/Background';
import BottomNav from './Components/BottomNav';
import MainContent from './Components/MainContent';
import PromptText from './Components/PromptText';

export default function Layout() {
  const navigateTo = useStrictNavigationAdapter();
  const { isMobile } = useLayoutStore();
  const pathname = usePathname();
  const redirectWhiteList = useMemo(
    () => [StaticRoutes.ERROR, StaticRoutes.GO_TO_MOBILE] as string[],
    []
  );

  useCheckStorage();

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (!isMobile && !redirectWhiteList.includes(pathname)) {
      navigateTo.goToMobile();
    }
  }, [pathname, navigateTo, redirectWhiteList]);

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
          <MainContent />
          <BottomNav />
        </div>
      </div>
    </>
  );
}
