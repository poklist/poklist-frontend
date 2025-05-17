import { pipe } from '@/lib/functional';
import useAuthStore from '@/stores/useAuthStore';
import useCommonStore from '@/stores/useCommonStore';
import { useCallback } from 'react';

/**
 * 檢查使用者是否已登入，如未登入則顯示登入對話框
 */
export const useAuthCheck = () => {
  const { isLoggedIn } = useAuthStore();
  const { setIsLoginDrawerOpen } = useCommonStore();

  // 基本檢查函數
  const checkAuth = useCallback((): boolean => {
    if (!isLoggedIn) {
      setIsLoginDrawerOpen(true);
      return false;
    }
    return true;
  }, [isLoggedIn, setIsLoginDrawerOpen]);

  return { checkAuth };
};

/**
 * 保護函數，確保函數只在使用者已登入時執行
 *
 * 用法：
 * const { protect } = useAuthProtect();
 *
 * const protectedFunc = protect(() => {
 *   // 只在已登入時執行的代碼
 * });
 */
export const useAuthProtect = () => {
  const { checkAuth } = useAuthCheck();

  // 保護函數的執行
  const protect = <T extends any[], R>(fn: (...args: T) => R) => {
    return (...args: T): R | undefined => {
      if (checkAuth()) {
        return fn(...args);
      }
      return undefined;
    };
  };

  return { protect };
};

/**
 * 允許將多個函數組合在一起，並在最後加上登入保護
 *
 * 用法：
 * const { protectPipe } = useAuthPipe();
 *
 * const processAndSend = protectPipe(
 *   validateData,
 *   transformData,
 *   sendData
 * );
 */
export const useAuthPipe = () => {
  const { protect } = useAuthProtect();

  // 組合函數，並在最後加上登入保護
  const protectPipe = (...fns: Array<(a: any) => any>) => {
    const composedFn = pipe(fns[0], ...fns.slice(1));
    return protect(composedFn);
  };

  return { protectPipe };
};

/**
 * 更通用的條件執行函數
 *
 * 用法：
 * const { executeWhen } = useConditionalExecution();
 *
 * // 只在用戶已登入時顯示會員專屬內容
 * const showMemberContent = executeWhen(
 *   () => authStore.isLoggedIn,
 *   () => displayMemberContent()
 * );
 */
export const useConditionalExecution = () => {
  const executeWhen = <T extends any[], R>(
    condition: (...args: T) => boolean,
    fn: (...args: T) => R
  ) => {
    return (...args: T): R | undefined => {
      if (condition(...args)) {
        return fn(...args);
      }
      return undefined;
    };
  };

  return { executeWhen };
};

/**
 * 更靈活的高階鉤子，支持更多自定義行為
 *
 * 用法：
 * const { withAuth } = useAuthWrapper({
 *   onNotAuthorized: () => showCustomLoginModal(),
 *   beforeExecution: () => trackAnalytics('auth-action-attempted'),
 *   afterExecution: (result) => console.log('Action result:', result)
 * });
 *
 * const secureFunction = withAuth(() => {
 *   // 安全操作
 * });
 */
export interface AuthWrapperOptions<R> {
  onNotAuthorized?: () => void;
  beforeExecution?: () => void;
  afterExecution?: (result: R) => void;
}

export const useAuthWrapper = <R>(options?: AuthWrapperOptions<R>) => {
  const { isLoggedIn } = useAuthStore();
  const { setIsLoginDrawerOpen } = useCommonStore();

  const withAuth = <T extends any[]>(fn: (...args: T) => R) => {
    return (...args: T): R | undefined => {
      // 未登入處理
      if (!isLoggedIn) {
        if (options?.onNotAuthorized) {
          options.onNotAuthorized();
        } else {
          setIsLoginDrawerOpen(true);
        }
        return undefined;
      }

      // 執行前鉤子
      if (options?.beforeExecution) {
        options.beforeExecution();
      }

      // 執行函數
      const result = fn(...args);

      // 執行後鉤子
      if (options?.afterExecution) {
        options.afterExecution(result);
      }

      return result;
    };
  };

  return { withAuth };
};
