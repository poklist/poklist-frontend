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
    // edit = Done，直接送出
    await page.getByTestId('edit-mode-save').click();
    await page.waitForURL(/\/usera\/list\/100(\/|$|\?)/);
    await expect(
      page.getByText('Public List Edited', { exact: true })
    ).toBeVisible();
  });
});
