export const createDebouncedRegistry = (prefix: string) => {
  const debounceMap = new Map<string, ReturnType<typeof setTimeout>>();

  const debounceKey = (id: string) => `${prefix}-${id}`;

  return {
    schedule: (id: string, delayMs: number, action: () => void) => {
      const key = debounceKey(id);
      clearTimeout(debounceMap.get(key));
      const timer = setTimeout(() => {
        debounceMap.delete(key);
        action();
      }, delayMs);
      debounceMap.set(key, timer);
    },
    cancel: (id: string) => {
      const key = debounceKey(id);
      const timer = debounceMap.get(key);
      if (timer) {
        clearTimeout(timer);
        debounceMap.delete(key);
      }
    },
  };
};
