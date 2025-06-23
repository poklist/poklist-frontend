import useStrictNavigationNext from './useStrictNavigateNext';

/**
 * 導航適配器hook，在 Next.js App Router 環境中使用 Next.js 的導航
 * 這是為了在從 React Router 遷移到 Next.js 過程中提供統一的導航介面
 */
const useStrictNavigationAdapter = () => {
  // 在 Next.js App Router 環境中，直接使用 Next.js 的導航
  return useStrictNavigationNext();
};

export default useStrictNavigationAdapter;
