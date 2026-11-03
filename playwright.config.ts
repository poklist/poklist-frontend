import { defineConfig, devices } from '@playwright/test';

const APP_PORT = 8080;
const MOCK_PORT = 4000;
const BASE_URL = `http://localhost:${APP_PORT}`;
// feature toggle 全部關閉的第二份 build（NEXT_PUBLIC_* 在 build 時寫死，無法同一份 build 切換）
const FLAGS_OFF_PORT = 8081;
const FLAGS_OFF_BASE_URL = `http://localhost:${FLAGS_OFF_PORT}`;
// 主 build 開啟的 feature toggle（src/constants/features.ts）
const FEATURES_ON = { NEXT_PUBLIC_FEATURE_LIST_LOCK: 'true' };
const FEATURES_OFF = { NEXT_PUBLIC_FEATURE_LIST_LOCK: 'false' };

export default defineConfig({
  testDir: './e2e',
  // Serialised on purpose: every worker shares ONE mock-server process on
  // port 4000 whose fixture state is a single module-level object
  // (e2e/mock-server/state.ts). Each test's beforeEach POSTs
  // /__test__/reset, which reassigns that shared object — with more than
  // one worker, a sibling test's in-flight requests can land against a
  // state object that was just reset out from under them. Per-worker state
  // isolation is not viable here: page navigations trigger Server
  // Component fetches from the Next.js server process, which cannot carry
  // a per-worker header, so browser-side and SSR-side requests could never
  // agree on which worker's state to use. Do NOT raise `workers` back up —
  // it will reintroduce intermittent failures once a spec performs a
  // successful mutation (e.g. deleting an idea).
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile-chrome',
      testIgnore: [/smoke\//, /flags-off\//],
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      testIgnore: [/smoke\//, /flags-off\//],
      use: { ...devices['iPhone 13'] },
    },
    {
      // 只跑 e2e/flags-off/：驗證 feature toggle 關閉時（等同正式環境預設）的行為
      name: 'flags-off',
      testMatch: /flags-off\//,
      use: { ...devices['Pixel 7'], baseURL: FLAGS_OFF_BASE_URL },
    },
    {
      name: 'smoke',
      testMatch: /smoke\//,
      use: {
        ...devices['Pixel 7'],
        baseURL: process.env.E2E_SMOKE_BASE_URL ?? BASE_URL,
        // Smoke tests send a real `Authorization: Bearer <token>` against a
        // real dev backend. Playwright trace/screenshot capture would embed
        // that token (and possibly real account data) into files written
        // under test-results/, which CI may upload as artifacts. Keep this
        // off for the smoke project — do NOT re-enable it here even to
        // debug a failure; use local runs with your own token instead.
        trace: 'off',
        screenshot: 'off',
      },
    },
  ],
  webServer: [
    {
      command: 'npx tsx e2e/mock-server/start.ts',
      url: `http://localhost:${MOCK_PORT}/usera/info`,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
    },
    {
      // Build here (via `build:e2e`), not just start: SEO_FETCH_REVALIDATE affects
      // build-time prerendering, so building without it renders routes like
      // /[userCode]/list/[id] as static, then runtime (which does set
      // SEO_FETCH_REVALIDATE=0) forces dynamic rendering and Next throws
      // "Page changed from static to dynamic at runtime". Do not "optimise" this
      // back down to a separate pre-built `npm run start` — build and run must
      // share the same env.
      command: 'npm run build:e2e && npm run start',
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 480_000,
      env: {
        NEXT_PUBLIC_API_BASE_URL: `http://localhost:${MOCK_PORT}`,
        NEXT_PUBLIC_SITE_URL: BASE_URL,
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'e2e-placeholder-client-id',
        SEO_FETCH_REVALIDATE: '0',
        ...FEATURES_ON,
      },
    },
    {
      // feature toggle 關閉的第二份 build：輸出到另一個 distDir、跑在另一個 port。
      // webServer 依序啟動，上一個 ready 後才 build 這份，所以 lingui extract 不會同時寫檔。
      command: `npm run build:e2e && npx next start -p ${FLAGS_OFF_PORT}`,
      url: FLAGS_OFF_BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 480_000,
      env: {
        NEXT_PUBLIC_API_BASE_URL: `http://localhost:${MOCK_PORT}`,
        NEXT_PUBLIC_SITE_URL: FLAGS_OFF_BASE_URL,
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'e2e-placeholder-client-id',
        SEO_FETCH_REVALIDATE: '0',
        NEXT_DIST_DIR: '.next-flags-off',
        ...FEATURES_OFF,
      },
    },
  ],
});
