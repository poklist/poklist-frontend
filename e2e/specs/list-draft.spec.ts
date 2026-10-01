import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

// 草稿特徵測試（create-only）：useListDraft 在閒置 2 秒自存 LIST_DRAFT；
// 重新開啟 /list/create 偵測到草稿會彈 DraftDrawer；keep=還原、delete=移除。
test.describe('list draft (create, logged-in)', () => {
  test.use({ storageState: buildStorageState() });

  test('D1 idle autosave, then DraftDrawer restores on reload', async ({
    page,
  }) => {
    await page.goto('/list/create');
    await page.getByTestId('list-title-input').fill('Draft WIP Title');
    // useIdle timeout=2000ms：閒置 2 秒後把表單寫進 LIST_DRAFT
    await page.waitForTimeout(2500);
    await page.reload();
    // 偵測到草稿 → 掛載時彈 DraftDrawer
    await expect(page.getByTestId('draft-keep')).toBeVisible();
    await page.getByTestId('draft-keep').click();
    await expect(page.getByTestId('list-title-input')).toHaveValue(
      'Draft WIP Title'
    );
  });

  test('D2 delete draft removes it (gone on next reload)', async ({ page }) => {
    await page.goto('/list/create');
    await page.getByTestId('list-title-input').fill('Draft To Delete');
    await page.waitForTimeout(2500);
    await page.reload();
    await expect(page.getByTestId('draft-delete')).toBeVisible();
    await page.getByTestId('draft-delete').click();
    // 草稿已移除：再次重載不再彈 DraftDrawer、標題為空
    await page.reload();
    await expect(page.getByTestId('draft-keep')).toHaveCount(0);
    await expect(page.getByTestId('list-title-input')).toHaveValue('');
  });
});
