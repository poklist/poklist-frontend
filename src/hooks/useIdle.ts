import useTimeout from '@/hooks/useTimeout';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, UseFormWatch } from 'react-hook-form';

type UseIdleOptions<T extends FieldValues> = {
  timeout?: number;
  // events?: string[]; // 待有 useEventListener 再完成
  initialState?: boolean;
  watch?: UseFormWatch<T>;
};

type UseIdleReturn = {
  isIdle: boolean;
  lastActive: number;
  reset: () => void;
};

const useIdle = <T extends FieldValues>({
  timeout = 60000, // 預設 1 分鐘
  // events = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart'],
  initialState = false,
  watch,
}: UseIdleOptions<T> = {}): UseIdleReturn => {
  const [isIdle, setIsIdle] = useState(initialState);
  const [lastActive, setLastActive] = useState<number>(Date.now());
  const lastActiveRef = useRef<number>(Date.now());

  // idle 到期時觸發
  const handleIdle = () => {
    setIsIdle(true);
  };

  const { start, stop } = useTimeout(handleIdle, timeout);

  const reset = useCallback(() => {
    setIsIdle(false);
    stop();
    start();
  }, [start, stop]);

  // Trigger
  const handleActivity = useCallback(() => {
    const now = Date.now();
    lastActiveRef.current = now;

    if (isIdle) {
      setIsIdle(false);
      setLastActive(now); // 只在 idle → active 時更新狀態
    }

    stop();
    start();
  }, [isIdle, start, stop]);

  // // init lastActive
  // useEffect(() => {
  //   setLastActive(lastActiveRef.current);
  // }, []);

  // // 事件模式：監聽使用者行為
  // useEffect(() => {
  //   if (events && events.length > 0) {
  //     events.forEach((event) => window.addEventListener(event, handleActivity));
  //   }

  //   return () => {。
  //     if (events && events.length > 0) {
  //       events.forEach((event) =>
  //         window.removeEventListener(event, handleActivity)
  //       );
  //     }
  //     stop();
  //   };
  // }, [events, reset, stop]);

  // React Hook Form watch 模式
  useEffect(() => {
    if (!watch) {
      return;
    }
    const subscription = watch(() => {
      handleActivity();
    });

    start();

    return () => {
      subscription.unsubscribe();
      stop();
    };
  }, [watch]);

  return { isIdle, lastActive, reset };
};

export default useIdle;
