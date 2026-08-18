import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

const TOKEN = process.env.E2E_ACCESS_TOKEN;
const USER_CODE = process.env.E2E_SMOKE_USER_CODE ?? '';
const LIST_ID = process.env.E2E_SMOKE_LIST_ID ?? '';
const BASE_URL = process.env.E2E_SMOKE_BASE_URL;

// token 過期或未設定時整組 skip —— 不讓煙霧層擋住 PR
test.skip(
  !TOKEN || !USER_CODE || !LIST_ID || !BASE_URL,
  'E2E_ACCESS_TOKEN / E2E_SMOKE_USER_CODE / E2E_SMOKE_LIST_ID / E2E_SMOKE_BASE_URL not configured'
);

test.use({
  storageState: buildStorageState({ token: TOKEN, origin: BASE_URL }),
});

test('S1 discovery page renders', async ({ page }) => {
  await page.goto('/discovery');
  await expect(page).not.toHaveURL(/goToMobile|error/);
});

test('S2 user profile page renders list section', async ({ page }) => {
  await page.goto(`/${USER_CODE}`);
  // Assert on `list-row`, not `hero`/`list-preview`: those testids also
  // appear on the loading skeletons (HeroSectionSkeleton /
  // ListSectionSkeleton), so asserting their visibility would pass even if
  // the page were stuck in a permanently-loading skeleton state. `list-row`
  // is only rendered by ListSection once real list data has loaded, so it
  // is the anchor that actually proves the list section rendered.
  await expect(page.locator('[data-testid="list-row"]').first()).toBeVisible();
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
  // 契約關鍵欄位與型別 —— 任一消失或型別漂移代表 BE 改了合約，
  // 前端 zod parse 會在 runtime 炸（zod 對型別漂移也會 throw，
  // 光用 toHaveProperty 抓不到，所以這裡要斷言型別）
  expect(typeof body.content.likeCount).toBe('number');
  expect(typeof body.content.isLiked).toBe('boolean');
  expect(typeof body.content.ideaTotalCount).toBe('number');
  expect(Array.isArray(body.content.ideas)).toBe(true);
  expect(typeof body.content.owner).toBe('object');
  expect(typeof body.content.owner.id).toBe('number');
  expect(typeof body.content.owner.userCode).toBe('string');
  expect(typeof body.totalElements).toBe('number');
  expect(typeof body.offset).toBe('number');
  expect(typeof body.limit).toBe('number');
});
