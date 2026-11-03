import { expect, test, type Page, type Request } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

// 主 build 開啟 FEATURES.listLock（playwright.config.ts），建立名單走新的 POST /creator/lists；
// 關閉時走舊 POST /lists 的情況見 e2e/flags-off/list-lock-off.spec.ts
const waitForCreate = (page: Page) =>
  page.waitForRequest(
    (req) =>
      req.method() === 'POST' &&
      new URL(req.url()).pathname === '/creator/lists'
  );

const bodyOf = (req: Request) => req.postDataJSON() as Record<string, unknown>;

test.describe('list create (logged-in)', () => {
  test.use({ storageState: buildStorageState() });

  test('creates a list and navigates to the new list page', async ({
    page,
  }) => {
    await page.goto('/list/create');
    await page.getByTestId('list-title-input').fill('My New List');
    // 底部主鈕（create = Next）→ 打開分類 drawer
    await page.getByTestId('edit-mode-save').click();
    const createRequest = waitForCreate(page);
    // drawer 內送出（categoryID 預設 0 → 不送，BE 預設 1）
    await page.getByTestId('category-submit').click();
    const request = await createRequest;
    const body = bodyOf(request);
    expect(body.title).toBe('My New List');
    // BE 不接受 null 與 categoryID 0；不上鎖時不送 lock（BE §3、§5）
    expect(JSON.stringify(body)).not.toContain('null');
    expect(body).not.toHaveProperty('categoryID');
    expect(body).not.toHaveProperty('lock');
    expect(request.headers()['idempotency-key']).toBeTruthy();
    await page.waitForURL(/\/usera\/list\/new-/);
    await expect(page.getByText('My New List', { exact: true })).toBeVisible();
  });

  test('creates a question-locked list with lock in the body', async ({
    page,
  }) => {
    await page.goto('/list/create');
    await page.getByTestId('list-title-input').fill('Locked List');
    await page.getByTestId('list-lock-switch').click();
    await page.getByTestId('lock-type-question').click();
    await page.getByTestId('lock-question-input').fill('  你最想去哪裡？ ');
    await page.getByTestId('lock-config-done').click();
    await page.getByTestId('edit-mode-save').click();
    const createRequest = waitForCreate(page);
    await page.getByTestId('category-submit').click();
    expect(bodyOf(await createRequest).lock).toEqual({
      method: 'question',
      question: '你最想去哪裡？',
    });
    await page.waitForURL(/\/usera\/list\/new-/);
  });
});
