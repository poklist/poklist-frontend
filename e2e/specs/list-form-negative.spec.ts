import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('list form negative paths (logged-in)', () => {
  test.use({ storageState: buildStorageState() });

  // N1 取消確認：dirty 後按關閉 → 出現確認 drawer；繼續編輯 → 留在原頁
  test('N1 dirty close shows cancel-confirm drawer; continue keeps page', async ({
    page,
  }) => {
    await page.goto('/list/create');
    await page.getByTestId('list-title-input').fill('WIP');
    await page.getByTestId('edit-mode-close').click();
    await expect(page.getByTestId('cancel-continue')).toBeVisible();
    await page.getByTestId('cancel-continue').click();
    await expect(page).toHaveURL(/\/list\/create/);
  });

  // N2 存檔鈕 disabled：title 空 → disabled；填入 → enabled
  test('N2 save button disabled until title present', async ({ page }) => {
    await page.goto('/list/create');
    await expect(page.getByTestId('edit-mode-save')).toBeDisabled();
    await page.getByTestId('list-title-input').fill('Now valid');
    await expect(page.getByTestId('edit-mode-save')).toBeEnabled();
  });

  // N3 驗證失敗（drawer）：標題過長（>60）→ error drawer、不導頁
  test('N3 too-long title surfaces error drawer, no navigation', async ({
    page,
  }) => {
    await page.goto('/list/create');
    await page.getByTestId('list-title-input').fill('x'.repeat(61));
    await page.getByTestId('edit-mode-save').click();
    await page.getByTestId('category-submit').click();
    await expect(page.getByText(/title is too long/i)).toBeVisible();
    await expect(page).toHaveURL(/\/list\/create/);
  });

  // N4 驗證失敗（toast）：external link 無效 → toast、不導頁。
  // 用 'http://'（空 host）：WHATWG URL 解析在 V8 與 WebKit 皆丟錯，故兩引擎一致失敗。
  // 註：'has space' 之類在 V8 會被接受、WebKit 會拒絕，跨引擎不穩，勿用。
  test('N4 invalid external link surfaces toast, no navigation', async ({
    page,
  }) => {
    await page.goto('/list/create');
    await page.getByTestId('list-title-input').fill('Valid title');
    await page.getByTestId('list-link-input').fill('http://');
    await page.getByTestId('edit-mode-save').click();
    await page.getByTestId('category-submit').click();
    await expect(page.getByText(/Link must start with/i)).toBeVisible();
    await expect(page).toHaveURL(/\/list\/create/);
  });

  // N5 API 5xx：mock 對 __FAIL__ 回 500 → 留在原頁、資料不失
  test('N5 API 5xx keeps user on form with data intact', async ({ page }) => {
    await page.goto('/list/create');
    await page.getByTestId('list-title-input').fill('__FAIL__');
    await page.getByTestId('edit-mode-save').click();
    await page.getByTestId('category-submit').click();
    await expect(page).toHaveURL(/\/list\/create/);
    await expect(page.getByTestId('list-title-input')).toHaveValue('__FAIL__');
  });
});
