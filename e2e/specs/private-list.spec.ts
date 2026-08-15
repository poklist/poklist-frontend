import { expect, test } from '@playwright/test';
import { anonymousStorageState, buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('owner', () => {
  test.use({ storageState: buildStorageState() });

  // E8：擁有者可正常看到自己的 private list
  test('E8 owner can view own private list', async ({ page }) => {
    await page.goto('/usera/list/101');
    await expect(page.getByText('Private List', { exact: true })).toBeVisible();
  });
});

test.describe('anonymous', () => {
  test.use({ storageState: anonymousStorageState });

  // E7：無權者看到 Not Found，且頁面不得洩漏 list 標題
  test('E7 anonymous gets not found for private list', async ({ page }) => {
    await page.goto('/usera/list/101');
    // 正向斷言確實抵達 Not Found 頁（見 src/app/not-found.tsx），
    // 避免「標題不存在」在頁面尚未載入完成時就誤判為通過。
    await expect(page.getByText('Oops something is wrong!')).toBeVisible();
    await expect(page.getByText('Private List', { exact: true })).toHaveCount(
      0
    );
  });
});

test.describe('public list stays reachable', () => {
  test.use({ storageState: anonymousStorageState });

  test('anonymous can view public list', async ({ page }) => {
    await page.goto('/usera/list/100');
    await expect(page.getByText('Public List', { exact: true })).toBeVisible();
  });
});
