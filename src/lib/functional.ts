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
export const pipe = <T extends unknown[], R>(
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
export const when = <T extends unknown[], R>(
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
export const curry = <T extends unknown[], R>(fn: (...args: T) => R) => {
  return function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return fn(...(args as T));
    }
    return (...nextArgs: unknown[]) => curried(...args, ...nextArgs);
  };
};

/**
 * 偏應用（Partial Application）- 預先填充函數的部分參數
 */
export const partial = <T extends unknown[], R>(
  fn: (...args: T) => R,
  ...preArgs: Partial<T>
) => {
  return (...restArgs: unknown[]): R => {
    const args = [...preArgs, ...restArgs] as T;
    return fn(...args);
  };
};

/**
 * 輔助Function - Sort object
 */
export const sortObjectKeys = (obj: unknown): unknown => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sortObjectKeys(item));
  }

  const recordObj = obj as Record<string, unknown>;

  const sortedKeys = Object.keys(recordObj).sort();
  const sortedObj: { [key: string]: unknown } = {};

  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeys(recordObj[key]); // 遞迴處理巢狀
  }
  return sortedObj;
};

/**
 * 記憶化（Memoization）- 緩存函數結果以提高性能，Sort & Clear
 */
export const memoize = <T extends unknown[], R>(
  fn: (...args: T) => R
): {
  (...args: T): R;
  clearCache: () => void;
} => {
  const cache = new Map<string, R>();

  const memoizedFn = ((...args: T): R => {
    const sortedArgs = args.map((arg) => sortObjectKeys(arg));
    const key = JSON.stringify(sortedArgs);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as {
    (...args: T): R;
    clearCache: () => void;
  };

  memoizedFn.clearCache = () => {
    cache.clear();
  };

  return memoizedFn;
};

/**
 * 節流（Throttle）- 限制函數在一定時間內只執行一次
 */
export const throttle = <T extends unknown[]>(
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
export const debounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: T): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
