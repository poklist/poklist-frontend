import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

const TOKEN = process.env.E2E_ACCESS_TOKEN;
const USER_CODE = process.env.E2E_SMOKE_USER_CODE ?? '';
const LIST_ID = process.env.E2E_SMOKE_LIST_ID ?? '';

// token 過期或未設定時整組 skip —— 不讓煙霧層擋住 PR
test.skip(
  !TOKEN || !USER_CODE || !LIST_ID,
  'E2E_ACCESS_TOKEN / E2E_SMOKE_USER_CODE / E2E_SMOKE_LIST_ID not configured'
);

test.use({
  storageState: buildStorageState({ token: TOKEN }),
});

test('S1 discovery page renders', async ({ page }) => {
  await page.goto('/discovery');
  await expect(page).not.toHaveURL(/goToMobile|error/);
});

test('S2 user profile page renders list section', async ({ page }) => {
  await page.goto(`/${USER_CODE}`);
  await expect(page.getByTestId('hero')).toBeVisible();
});

test('S3 list page renders with like button', async ({ page }) => {
  await page.goto(`/${USER_CODE}/list/${LIST_ID}`);
  await expect(page.getByTestId('like-button')).toBeVisible();
});

test('S4 list page loads ideas', async ({ page }) => {
  await page.goto(`/${USER_CODE}/list/${LIST_ID}`);
  await expect(page.locator('[data-testid="idea-row"]').first()).toBeVisible();
});

test('S5 real API contract has not drifted on list endpoint', async ({
  request,
}) => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  test.skip(!base, 'NEXT_PUBLIC_API_BASE_URL not set');

  const res = await request.get(`${base}/lists/${LIST_ID}?offset=0&limit=1`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  expect(res.status()).toBe(200);

  const body = await res.json();
  // 契約關鍵欄位 —— 任一消失代表 BE 改了合約，前端 zod parse 會在 runtime 炸
  expect(body.content).toHaveProperty('isLiked');
  expect(body.content).toHaveProperty('likeCount');
  expect(body.content).toHaveProperty('ideaTotalCount');
  expect(body.content).toHaveProperty('owner');
  expect(body).toHaveProperty('totalElements');
});
