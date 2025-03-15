import AlertComponent from '@/components/Alert';
import { ErrorDrawer } from '@/components/ErrorDrawer';
import LoadingSpinner from '@/components/Loading';
import useCommonStore from '@/stores/useCommonStore';
import { Outlet } from 'react-router-dom';

// 主要內容區域組件
const MainContent = () => {
  const { isLoading } = useCommonStore();

  return (
    <div className="relative h-screen w-full overflow-hidden sm:h-[calc(100vh-120px)] sm:w-mobile-max sm:rounded-[20px] sm:border sm:border-black">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="sticky top-0 z-50 bg-white">
          <AlertComponent />
        </div>
        <div className="-mr-[3.8px] flex-1 overflow-y-auto bg-white">
          <Outlet />
        </div>
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <ErrorDrawer />
    </div>
  );
};

export default MainContent;
