import logoBig from '@/assets/images/logo-relist.svg';

// 背景組件
const Background = () => {
  return (
    <>
      {/* 背景網格 - 只在桌面版顯示 */}
      <div
        id="desktop-background"
        className="fixed inset-0 z-[-2] hidden bg-white bg-user-page-grid bg-0.3% opacity-25 sm:block"
      />

      {/* 背景 Logo - 只在桌面版顯示 */}
      <div
        id="desktop-banner-logo"
        className="fixed left-1/2 top-1/2 z-[-1] hidden -translate-x-1/2 -translate-y-1/2 overflow-hidden sm:block"
      >
        <div className="flex h-[697px] w-[1439px] items-center justify-center">
          <img src={logoBig} alt="Background Logo" className="h-full w-[90%]" />
        </div>
      </div>
    </>
  );
};

export default Background;
