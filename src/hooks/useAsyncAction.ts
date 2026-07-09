import { useRef } from 'react';

/**
 * 把 async handler 包成同步 handler：
 * - 滿足 onClick 等期望 void 的位置（no-misused-promises）
 * - in-flight 期間忽略重複觸發（防連點）
 * - rejection 統一落到 onError，不再靜默蒸發
 */
export const useAsyncAction = <Args extends unknown[]>(
  action: (...args: Args) => Promise<void> | void,
  onError: (error: unknown) => void = (error) => console.error(error)
): ((...args: Args) => void) => {
  const inFlightRef = useRef(false);

  return (...args: Args) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    Promise.resolve(action(...args))
      .catch(onError)
      .finally(() => {
        inFlightRef.current = false;
      });
  };
};
