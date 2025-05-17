/**
 * 函數組合 - 從右到左組合多個函數
 * compose(f, g, h)(x) 等同於 f(g(h(x)))
 */
export const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) => {
  return fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn1);
};

/**
 * 函數組合 - 從左到右組合多個函數
 * pipe(f, g, h)(x) 等同於 h(g(f(x)))
 */
export const pipe = <T extends any[], R>(
  fn1: (...args: T) => R,
  ...fns: Array<(a: R) => R>
) => {
  return (...args: T): R => {
    return fns.reduce((prev, fn) => fn(prev), fn1(...args));
  };
};

/**
 * 創建一個函數，該函數只在滿足斷言時才執行原函數
 */
export const when = <T extends any[], R>(
  predicate: (...args: T) => boolean,
  fn: (...args: T) => R
) => {
  return (...args: T): R | undefined => {
    if (predicate(...args)) {
      return fn(...args);
    }
    return undefined;
  };
};

/**
 * 柯里化（Currying）- 將接受多個參數的函數轉換為一系列接受單個參數的函數
 */
export const curry = <T extends any[], R>(fn: (...args: T) => R) => {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...(args as T));
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  };
};

/**
 * 偏應用（Partial Application）- 預先填充函數的部分參數
 */
export const partial = <T extends any[], R>(
  fn: (...args: T) => R,
  ...preArgs: Partial<T>
) => {
  return (...restArgs: any[]): R => {
    const args = [...preArgs, ...restArgs] as T;
    return fn(...args);
  };
};

/**
 * 記憶化（Memoization）- 緩存函數結果以提高性能
 */
export const memoize = <T extends any[], R>(fn: (...args: T) => R) => {
  const cache = new Map<string, R>();

  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * 節流（Throttle）- 限制函數在一定時間內只執行一次
 */
export const throttle = <T extends any[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  let lastCall = 0;

  return (...args: T): void => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      fn(...args);
      lastCall = now;
    }
  };
};

/**
 * 防抖（Debounce）- 延遲函數執行，若在延遲時間內再次調用則重新計時
 */
export const debounce = <T extends any[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: T): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
