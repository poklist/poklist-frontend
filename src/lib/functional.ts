/**
 * Function composition - combines multiple functions from right to left
 * compose(f, g, h)(x) is equivalent to f(g(h(x)))
 */
export const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) => {
  return fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn1);
};

/**
 * Function composition - combines multiple functions from left to right
 * pipe(f, g, h)(x) is equivalent to h(g(f(x)))
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
 * Creates a function that only executes the original function when the predicate is satisfied
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
 * Currying - transforms a function that takes multiple arguments into a series of functions that each take a single argument
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
 * Partial Application - pre-fills some of the arguments of a function
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
 * Helper Function - Sort object
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
 * Memoization - caches function results to improve performance
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
 * Throttle - limits a function to execute at most once in a specified time period
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
 * Debounce - delays function execution and resets the timer if called again within the delay period
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

/**
 * Enhanced Debounce - provides additional control options for debounced functions
 * @param fn Function to execute
 * @param delay Delay time in milliseconds
 * @param options Additional options
 * @param options.shouldExecute Pre-execution condition check function
 * @param options.onNotAllowed Callback when condition check fails
 * @param options.onBeforeExecute Pre-execution callback
 * @param options.onAfterExecute Post-execution callback
 */
export const enhancedDebounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
  options?: {
    shouldExecute?: () => boolean;
    onNotAllowed?: () => void;
    onBeforeExecute?: () => void;
    onAfterExecute?: () => void;
  }
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: T): void => {
    if (options?.shouldExecute && !options.shouldExecute()) {
      options.onNotAllowed?.();
      return;
    }

    if (timer) clearTimeout(timer);

    options?.onBeforeExecute?.();

    timer = setTimeout(() => {
      fn(...args);
      options?.onAfterExecute?.();
    }, delay);
  };
};
