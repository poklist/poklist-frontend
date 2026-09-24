import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('list create (logged-in)', () => {
  test.use({ storageState: buildStorageState() });

  test('creates a list and navigates to the new list page', async ({ page }) => {
    await page.goto('/list/create');
    await page.getByTestId('list-title-input').fill('My New List');
    // 底部主鈕（create = Next）→ 打開分類 drawer
    await page.getByTestId('edit-mode-save').click();
    // drawer 內送出（categoryID 預設 0 合法）
    await page.getByTestId('category-submit').click();
    await page.waitForURL(/\/usera\/list\/new-/);
    await expect(
      page.getByText('My New List', { exact: true })
    ).toBeVisible();
  });
});
