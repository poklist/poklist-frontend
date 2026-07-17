import { listsContract } from '@/api/contracts';

/**
 * 把 ts-rest contract path（如 '/lists/:listID'）轉成可比對實際請求 URL 的 RegExp
 * 攔截器比對前已 split('?')[0]，query string 不需處理
 * 適用 src/api/contracts 下全部 path
 */
const contractPathToRegExp = (path: string): RegExp => {
  const pattern = path
    .split('/')
    .map((segment) =>
      segment.startsWith(':')
        ? '[^/]+'
        : segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )
    .join('/');
  return new RegExp(`^${pattern}$`);
};

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

export const STATUS_WHITELIST: StatusRule[] = [
  {
    method: 'GET',
    pattern: contractPathToRegExp(listsContract.getListsContract.path),
    status: [403],
  },
];

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
