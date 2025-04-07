import AlertComponent from '@/components/Alert';
import { ErrorDrawer } from '@/components/ErrorDrawer';
import LoadingSpinner from '@/components/Loading';
import useCommonStore from '@/stores/useCommonStore';
import { Outlet } from 'react-router-dom';

// 主要內容區域組件
const MainContent = () => {
  const { isLoading } = useCommonStore();

  return (
    <div className="relative h-screen w-full overflow-hidden sm:w-mobile-max sm:rounded-[20px] sm:border sm:border-black">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="fixed top-0 z-50 bg-white">
          <AlertComponent />
        </div>
        <div
          id="main-content"
          className="-mr-[3.8px] flex-1 overflow-x-hidden overflow-y-scroll bg-white"
        >
          <Outlet />
        </div>
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <ErrorDrawer />
    </div>
  );
};

export default MainContent;
