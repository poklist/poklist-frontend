import { expect, Page, test } from '@playwright/test';
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

  const waitForSettings = (page: Page, listID: string) =>
    page.waitForResponse(
      (res) => new URL(res.url()).pathname === `/creator/lists/${listID}`
    );

  const openPasswordConfig = async (page: Page) => {
    await page.getByTestId('list-lock-switch').click();
    await page.getByTestId('lock-type-password').click();
    await expect(page.getByTestId('lock-config-done')).toBeVisible();
  };

  const gotoPasswordConfig = async (page: Page, listID: string) => {
    const settings = waitForSettings(page, listID);
    await page.goto(`/usera/list/${listID}/edit`);
    await settings;
    await openPasswordConfig(page);
  };

  test('hides the lock change options for a list that was never locked', async ({
    page,
  }) => {
    await gotoPasswordConfig(page, '101');
    await expect(page.getByTestId('lock-change-method')).toHaveCount(0);
  });

  test('reset drawer opens on keep and drops an unconfirmed choice', async ({
    page,
  }) => {
    await gotoPasswordConfig(page, '100');
    const keep = page.locator('[role="radio"][value="false"]');
    const reset = page.locator('[role="radio"][value="true"]');

    await page.getByTestId('lock-change-method').click();
    await expect(keep).toBeChecked();
    await reset.click();
    await expect(reset).toBeChecked();

    // 沒按「確認設定」就關掉，再打開要回到「保留」
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(keep).toHaveCount(0);
    await page.getByTestId('lock-change-method').click();
    await expect(keep).toBeChecked();
    await expect(reset).not.toBeChecked();
  });

  test('confirming writes the reset choice into the form', async ({ page }) => {
    // 名單 100 是公開，開上鎖不會改 type，所以「完成」只看 resetReadPermissions
    const save = page.getByTestId('edit-mode-save');
    const confirmAndLeave = async () => {
      await page.getByTestId('reset-unlock-confirm').click();
      await expect(page.getByTestId('lock-type-password')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('lock-type-password')).toHaveCount(0);
    };

    await gotoPasswordConfig(page, '100');
    await page.getByTestId('lock-change-method').click();
    await confirmAndLeave();
    await expect(save).toBeDisabled();

    await openPasswordConfig(page);
    await page.getByTestId('lock-change-method').click();
    await page.locator('[role="radio"][value="true"]').click();
    await confirmAndLeave();
    await expect(save).toBeEnabled();
  });
});
