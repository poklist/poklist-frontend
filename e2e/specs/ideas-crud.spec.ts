import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.use({ storageState: buildStorageState() });

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

// E6：驗證「伺服器端刪除後，重新載入的畫面與伺服器狀態一致」。
//
// 本測試**不涵蓋** optimistic 雙 cache 同步（listsKeys.infiniteIdeas 與
// ideasKeys.infiniteIdeasUnderList）——刪除走原始 API 呼叫並 page.reload()，
// 完全繞過 app 的 client-side mutation 路徑。真正的免重整 cache 手術需要從
// UI 觸發刪除，但 IdeaDrawerContent 內的三點選單、「Delete Idea」項目與確認鍵
// 皆無 data-testid（只能靠 <Trans> 文案或 Radix role 辨識，兩者皆被禁用），
// 故 E2E 不可及；該邏輯改由 Task 12 的 cache helper 單元測試涵蓋。
test('E6 idea deleted via API is reflected after reload', async ({
  page,
  request,
}) => {
  await page.goto('/usera/list/101'); // private list，3 則 idea，屬於 usera
  await expect(page.locator('[data-testid="idea-row"]')).toHaveCount(3);

  await request.delete('http://localhost:4000/ideas/101-idea-1', {
    headers: { Authorization: 'Bearer e2e-fake-token' },
  });
  await page.reload();

  await expect(page.locator('[data-testid="idea-row"]')).toHaveCount(2);
  await expect(page.locator('[data-idea-id="101-idea-1"]')).toHaveCount(0);
});
