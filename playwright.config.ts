import { defineConfig, devices } from '@playwright/test';

const APP_PORT = 8080;
const MOCK_PORT = 4000;
const BASE_URL = `http://localhost:${APP_PORT}`;

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
      testIgnore: /smoke\//,
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      testIgnore: /smoke\//,
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'smoke',
      testMatch: /smoke\//,
      use: {
        ...devices['Pixel 7'],
        baseURL: process.env.E2E_SMOKE_BASE_URL ?? BASE_URL,
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
      timeout: 240_000,
      env: {
        NEXT_PUBLIC_API_BASE_URL: `http://localhost:${MOCK_PORT}`,
        NEXT_PUBLIC_SITE_URL: BASE_URL,
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'e2e-placeholder-client-id',
        SEO_FETCH_REVALIDATE: '0',
      },
    },
  ],
});
