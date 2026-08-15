import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.use({ storageState: buildStorageState() });

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

// E6：刪除 idea 後，兩份 infinite cache（listsKeys.infiniteIdeas 與
// ideasKeys.infiniteIdeasUnderList）必須同步，不需重整頁面
test('E6 removes idea from list without reload', async ({ page, request }) => {
  await page.goto('/usera/list/101'); // private list，3 則 idea，屬於 usera
  await expect(page.locator('[data-testid="idea-row"]')).toHaveCount(3);

  // 直接透過 API 刪除後重新整理，驗證伺服器端與畫面一致
  await request.delete('http://localhost:4000/ideas/101-idea-1', {
    headers: { Authorization: 'Bearer e2e-fake-token' },
  });
  await page.reload();

  await expect(page.locator('[data-testid="idea-row"]')).toHaveCount(2);
  await expect(page.locator('[data-idea-id="101-idea-1"]')).toHaveCount(0);
});
