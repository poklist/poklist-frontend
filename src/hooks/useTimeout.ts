import React from 'react';

const useTimeout = (callback: Function, delay: number) => {
  const callbackRef = React.useRef<Function | null>(callback);
  const timeoutIdRef = React.useRef<number | null>(null);

  if (!callbackRef.current) {
    callbackRef.current = callback;
  }

  const start = React.useCallback(() => {
    if (!timeoutIdRef.current) {
      timeoutIdRef.current = window.setTimeout(() => {
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
