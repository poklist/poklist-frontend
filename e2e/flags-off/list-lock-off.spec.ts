import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

// 跑在 feature toggle 全部關閉的第二份 build（playwright.config.ts 的 flags-off project，port 8081）。
// storageState 的 origin 必須和頁面 origin 相同，否則 Playwright 不會寫入登入狀態。
const FLAGS_OFF_ORIGIN = 'http://localhost:8081';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('listLock off (old /lists API)', () => {
  test.use({ storageState: buildStorageState({ origin: FLAGS_OFF_ORIGIN }) });

  // F1 toggle 關閉：上鎖 UI 照常顯示（Q21），建立名單送舊 /lists API 且 body 沒有 lock
  test('F1 creates a list via old /lists without lock', async ({ page }) => {
    await page.goto('/list/create');
    await expect(page.getByTestId('list-lock-switch')).toBeVisible();
    await page.getByTestId('list-title-input').fill('Flags Off List');
    await page.getByTestId('edit-mode-save').click();
    const createRequest = page.waitForRequest(
      (req) =>
        req.method() === 'POST' && new URL(req.url()).pathname === '/lists'
    );
    await page.getByTestId('category-submit').click();
    const body = (await createRequest).postDataJSON() as Record<
      string,
      unknown
    >;
    expect(body.title).toBe('Flags Off List');
    expect(body).not.toHaveProperty('lock');
    await page.waitForURL(/\/usera\/list\/new-/);
  });
});
