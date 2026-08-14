import { FAKE_TOKEN, TEST_USER_A } from './users';

const APP_ORIGIN = process.env.E2E_BASE_URL ?? 'http://localhost:8080';

/**
 * 組出「已登入」的 Playwright storageState。
 * 形狀必須與 zustand persist 的序列化結果一致：{ state, version }。
 * 對應 useAuthStore（name: 'auth-storage'）與 useUserStore（name: 'user-storage'）。
 */
export const buildStorageState = (
  options: { token?: string; user?: typeof TEST_USER_A } = {}
) => {
  const token = options.token ?? FAKE_TOKEN;
  const user = options.user ?? TEST_USER_A;
  return {
    cookies: [],
    origins: [
      {
        origin: APP_ORIGIN,
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
