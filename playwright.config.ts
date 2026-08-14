import { defineConfig, devices } from '@playwright/test';

const APP_PORT = 8080;
const MOCK_PORT = 4000;
const BASE_URL = `http://localhost:${APP_PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
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
