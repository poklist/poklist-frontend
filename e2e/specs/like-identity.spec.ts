import { expect, test } from '@playwright/test';
import { anonymousStorageState, buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('logged-in viewer', () => {
  test.use({ storageState: buildStorageState() });

  // E1:SSR 匿名回應含 isLiked:false,不得汙染已登入用戶的 like 狀態
  test('E1 shows liked state on direct URL entry', async ({ page }) => {
    await page.goto('/usera/list/100');
    const likeButton = page.getByTestId('like-button');
    await expect(likeButton).toHaveAttribute('data-liked', 'true');
  });

  // E1b:重新整理後仍正確(確認不是靠某次幸運的 refetch 時序)
  test('E1b keeps liked state after reload', async ({ page }) => {
    await page.goto('/usera/list/100');
    await expect(page.getByTestId('like-button')).toHaveAttribute(
      'data-liked',
      'true'
    );
    await page.reload();
    await expect(page.getByTestId('like-button')).toHaveAttribute(
      'data-liked',
      'true'
    );
  });
});

test.describe('anonymous viewer', () => {
  test.use({ storageState: anonymousStorageState });

  // E4:匿名點讚應跳登入引導,且不得寫入 like 狀態
  test('E4 prompts signup instead of liking', async ({ page }) => {
    await page.goto('/usera/list/100');
    const likeButton = page.getByTestId('like-button');
    await expect(likeButton).toHaveAttribute('data-liked', 'false');
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('data-liked', 'false');
  });
});

// E3:清除已儲存的登入狀態並重新整理後,應呈現未登入畫面且不帶有殘留的 like 狀態
test.describe('after clearing stored auth', () => {
  test.use({ storageState: buildStorageState() });

  // This does NOT exercise the seed-once path in client.tsx: after the
  // localStorage clear + reload the app is anonymous, so the effect's
  // `if (!isLoggedIn) return;` guard short-circuits before the
  // `hasLikeState` seed-once branch ever runs. True identity-switch
  // coverage is blocked by the mock server's single-viewer design
  // (viewerOf() in e2e/mock-server/server.ts maps any Authorization
  // header to `usera`).
  test('E3 shows unauthenticated view with no liked state after clearing stored auth', async ({
    page,
  }) => {
    await page.goto('/usera/list/100');
    await expect(page.getByTestId('like-button')).toHaveAttribute(
      'data-liked',
      'true'
    );

    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    await expect(page.getByTestId('like-button')).toHaveAttribute(
      'data-liked',
      'false'
    );
  });
});
