export const ABORT_WHITELIST = new Set<string>([]);

export const isAbortWhitelist = (method: string, path: string): boolean => {
  const key = `${method.toUpperCase()} ${path}`;
  return ABORT_WHITELIST.has(key);
};
