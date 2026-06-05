// 考慮到 exact-match 對動態 path 失效
type AbortRule = {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  pattern: RegExp;
};
export const ABORT_WHITELIST: AbortRule[] = [];

export const isAbortWhitelist = (method: string, path: string): boolean =>
  ABORT_WHITELIST.some(
    (rule) => rule.method === method.toUpperCase() && rule.pattern.test(path)
  );

type StatusRule = AbortRule & {
  status: number[];
};

export const STATUS_WHITELIST: StatusRule[] = [];

export const isStatusWhitelist = (
  method: string,
  path: string,
  status: number
): boolean =>
  STATUS_WHITELIST.some(
    (rule) =>
      rule.method === method.toUpperCase() &&
      rule.pattern.test(path) &&
      rule.status.includes(status)
  );
