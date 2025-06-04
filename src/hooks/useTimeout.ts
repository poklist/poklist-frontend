import React from 'react';

const useTimeout = (callback: () => void, delay: number) => {
  const callbackRef = React.useRef<() => void>(callback);
  const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);

  if (!callbackRef.current) {
    callbackRef.current = callback;
  }

  const start = React.useCallback(() => {
    if (!timeoutIdRef.current) {
      timeoutIdRef.current = setTimeout(() => {
        callbackRef.current?.();
        timeoutIdRef.current = null;
      }, delay);
    }
  }, [delay]);

  const stop = React.useCallback(() => {
    if (timeoutIdRef.current) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  return { start, stop };
};
export default useTimeout;
