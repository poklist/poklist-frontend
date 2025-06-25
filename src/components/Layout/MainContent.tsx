import AlertComponent from '@/components/Alert';
import { ErrorDrawer } from '@/components/ErrorDrawer';
import LoadingSpinner from '@/components/Loading';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { cn } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import useLayoutStore from '@/stores/useLayoutStore';
import { useUIStore } from '@/stores/useUIStore';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface MainContentProps {
  children?: React.ReactNode;
}

// 主要內容區域組件
const MainContent = ({ children }: MainContentProps) => {
  const { isMobile } = useLayoutStore();
  const { isLoading } = useCommonStore();
  const { setScrollToTop } = useUIStore();
  const pathname = usePathname();
  const isHomePage = pathname === '/discovery';

  const mainContentRef = useRef<HTMLDivElement>(null);
  // 使用自定義 hook 管理滾動位置
  useScrollPosition(mainContentRef, {
    restoreDelay: 0, // 可以調整延遲時間
  });

  useEffect(() => {
    setScrollToTop(() => {
      mainContentRef.current?.scroll({ top: 0, behavior: 'smooth' });
    });
  }, [setScrollToTop]);

  // LoginDrawer 相關邏輯已移至 ClientProviders 中的 LoginDrawerGlobal

  return (
    <div
      className={cn('relative h-screen w-full overflow-hidden', {
        'sm:w-mobile-max sm:rounded-[20px] sm:border sm:border-black':
          !isMobile,
      })}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="fixed top-0 z-50 bg-white">
          <AlertComponent />
        </div>
        <div
          ref={mainContentRef}
          id="main-content"
          className={cn(
            '-mr-[3.8px] flex-1 overflow-x-hidden overflow-y-scroll bg-white',
            {
              'bg-yellow-bright-01': isHomePage,
            }
          )}
        >
          {children}
        </div>
      </div>

      <LoadingSpinner isLoading={isLoading} />
      <ErrorDrawer />

      {/* LoginDrawer 現在在 ClientProviders 中全域處理 */}
    </div>
  );
};

export default MainContent;
