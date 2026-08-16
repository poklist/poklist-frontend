import { FAKE_TOKEN, TEST_USER_A } from './users';

const DEFAULT_APP_ORIGIN = process.env.E2E_BASE_URL ?? 'http://localhost:8080';

/**
 * 組出「已登入」的 Playwright storageState。
 * 形狀必須與 zustand persist 的序列化結果一致：{ state, version }。
 * 對應 useAuthStore（name: 'auth-storage'）與 useUserStore（name: 'user-storage'）。
 *
 * `origin` defaults to the deterministic suite's localhost app origin. The
 * smoke project points pages at a real dev origin (E2E_SMOKE_BASE_URL), so
 * it must pass that origin explicitly here — storageState's origins[].origin
 * must match the page's actual origin or Playwright silently skips seeding
 * localStorage for it, producing an unauthenticated session instead of a
 * failure. This must stay an explicit parameter, not module-level global
 * state read from env, so the two suites can never cross-contaminate when
 * run together in one invocation.
 */
export const buildStorageState = (
  options: {
    token?: string;
    user?: typeof TEST_USER_A;
    origin?: string;
  } = {}
) => {
  const token = options.token ?? FAKE_TOKEN;
  const user = options.user ?? TEST_USER_A;
  const origin = options.origin ?? DEFAULT_APP_ORIGIN;
  return {
    cookies: [],
    origins: [
      {
        origin,
        localStorage: [
          {
            name: 'auth-storage',
            value: JSON.stringify({
              state: { isLoggedIn: true, accessToken: token },
              version: 0,
            }),
          },
          {
            name: 'user-storage',
            value: JSON.stringify({ state: { me: user }, version: 0 }),
          },
        ],
      },
    ],
  };
};

/** 匿名狀態：完全空的 storage */
export const anonymousStorageState = { cookies: [], origins: [] };
