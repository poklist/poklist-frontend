import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('list form expand (logged-in)', () => {
  test.use({ storageState: buildStorageState() });

  // X1 展開「更多內容」後焦點移到描述欄（按鈕 unmount，焦點不可掉回 body）
  test('X1 expanding moves focus to description', async ({ page }) => {
    await page.goto('/list/create');
    await page.getByTestId('list-form-expand').click();
    await expect(page.getByTestId('list-form-expand')).toHaveCount(0);
    await expect(page.getByTestId('list-desc-input')).toBeFocused();
  });

  // X2 prefers-reduced-motion: reduce 時，新欄位不播放進場動畫
  test('X2 no enter animation when reduced motion is requested', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/list/create');
    await page.getByTestId('list-form-expand').click();
    const animationName = await page
      .locator('label', { has: page.getByTestId('list-desc-input') })
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).toBe('none');
  });

  // X3 未要求減少動態時，新欄位播放進場動畫
  test('X3 enter animation plays by default', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/list/create');
    await page.getByTestId('list-form-expand').click();
    const animationName = await page
      .locator('label', { has: page.getByTestId('list-desc-input') })
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).toBe('enter');
  });
});
