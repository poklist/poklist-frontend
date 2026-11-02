import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('list edit (owner)', () => {
  test.use({ storageState: buildStorageState() });

  test('edits list title and navigates back to the list page', async ({
    page,
  }) => {
    await page.goto('/usera/list/100/edit');
    const title = page.getByTestId('list-title-input');
    await expect(title).toHaveValue('Public List');
    await title.fill('Public List Edited');
    const editRequest = page.waitForRequest(
      (req) =>
        req.method() === 'PUT' && new URL(req.url()).pathname === '/lists/100'
    );
    // edit = Done，直接送出
    await page.getByTestId('edit-mode-save').click();
    // 舊 /lists API 不接受 lock（mock server 不檢查多餘欄位，需在此斷言）
    const body = (await editRequest).postDataJSON() as Record<string, unknown>;
    expect(body.title).toBe('Public List Edited');
    expect(body).not.toHaveProperty('lock');
    await page.waitForURL(/\/usera\/list\/100(\/|$|\?)/);
    await expect(
      page.getByText('Public List Edited', { exact: true })
    ).toBeVisible();
  });
});
