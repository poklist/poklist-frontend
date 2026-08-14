import { expect, test } from '@playwright/test';
import { anonymousStorageState, buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('logged-in viewer', () => {
  test.use({ storageState: buildStorageState() });

  // E2:usera 已 follow userb。直接貼 userb 的 list 網址時,
  // SSR 匿名回應含 isFollowing:false,不得汙染已登入用戶的 follow 狀態。
  test('E2 shows following state on direct URL entry', async ({ page }) => {
    await page.goto('/userb/list/102');
    await expect(page.getByTestId('follow-button')).toHaveAttribute(
      'data-following',
      'true'
    );
  });

  test('E2b keeps following state after reload', async ({ page }) => {
    await page.goto('/userb/list/102');
    await expect(page.getByTestId('follow-button')).toHaveAttribute(
      'data-following',
      'true'
    );
    await page.reload();
    await expect(page.getByTestId('follow-button')).toHaveAttribute(
      'data-following',
      'true'
    );
  });

  // 自己的 list 不該出現 follow 按鈕
  test('E2c hides follow button on own list', async ({ page }) => {
    await page.goto('/usera/list/100');
    await expect(page.getByTestId('follow-button')).toHaveCount(0);
  });

  // Profile page equivalent of E2: this is the surface where the original
  // follow-identity-contamination bug actually manifested.
  test('E2d shows following state on profile page direct URL entry', async ({
    page,
  }) => {
    await page.goto('/userb');
    await expect(page.getByTestId('follow-button')).toHaveAttribute(
      'data-following',
      'true'
    );
  });
});

test.describe('anonymous viewer', () => {
  test.use({ storageState: anonymousStorageState });

  // 匿名必須看到可點的「未追蹤」按鈕,而非卡在骨架
  test('anonymous sees follow button in not-following state', async ({
    page,
  }) => {
    await page.goto('/userb/list/102');
    await expect(page.getByTestId('follow-button')).toHaveAttribute(
      'data-following',
      'false'
    );
  });
});
