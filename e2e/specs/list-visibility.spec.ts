import { expect, test, type Page } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

// 點整張卡片（label）而非控制項本身；卡片中心落在文字上，不會點到 radio / switch
const cardOf = (page: Page, testId: string) =>
  page.locator('label', { has: page.getByTestId(testId) });

test.describe('list visibility fields (logged-in)', () => {
  test.use({ storageState: buildStorageState() });

  test.beforeEach(async ({ page }) => {
    await page.goto('/list/create');
  });

  // V1 開啟上鎖 → 同時選取「公開」
  test('V1 turning lock on selects public', async ({ page }) => {
    await page.getByTestId('list-visibility-private').click();
    await page.getByTestId('list-lock-switch').click();
    await expect(page.getByTestId('list-lock-switch')).toBeChecked();
    await expect(page.getByTestId('list-visibility-public')).toBeChecked();
  });

  // V2 點「公開」區塊 → 選取「公開」
  test('V2 clicking public card selects public', async ({ page }) => {
    await page.getByTestId('list-visibility-private').click();
    await cardOf(page, 'list-visibility-public').click();
    await expect(page.getByTestId('list-visibility-public')).toBeChecked();
  });

  // V3 點「設定上鎖」區塊 → 開關打開並跳出上鎖方式 drawer；未選方式就關閉 → 開關自動關回去
  test('V3 dismissing lock type drawer turns lock off', async ({ page }) => {
    const lockSwitch = page.getByTestId('list-lock-switch');
    await cardOf(page, 'list-lock-switch').click();
    await expect(lockSwitch).toBeChecked();
    await expect(page.getByTestId('lock-type-password')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('lock-type-password')).toBeHidden();
    await expect(lockSwitch).not.toBeChecked();
  });

  // V4 選了上鎖方式後再點「隱藏」區塊 → 選取「隱藏」並關閉上鎖（上鎖與隱藏互斥）
  test('V4 clicking private card selects private and turns lock off', async ({
    page,
  }) => {
    const lockSwitch = page.getByTestId('list-lock-switch');
    await lockSwitch.click();
    await page.getByTestId('lock-type-password').click();
    // 選方式後會開 LockConfigFakePage（全螢幕），按「完成」返回表單；上鎖維持開啟
    // （按 Esc /「取消」會關閉上鎖，見 V6）
    await page.getByTestId('lock-config-done').click();
    await expect(lockSwitch).toBeChecked();
    await cardOf(page, 'list-visibility-private').click();
    await expect(page.getByTestId('list-visibility-private')).toBeChecked();
    await expect(lockSwitch).not.toBeChecked();
  });

  // V5 底部說明文字隨公開／隱藏切換（比對切換前後文字不同，與語系無關）
  test('V5 summary text follows selected visibility', async ({ page }) => {
    const summary = page.getByTestId('list-visibility-summary');
    await page.getByTestId('list-visibility-public').click();
    const publicText = await summary.textContent();
    await page.getByTestId('list-visibility-private').click();
    await expect(summary).not.toHaveText(publicText ?? '');
    await page.getByTestId('list-visibility-public').click();
    await expect(summary).toHaveText(publicText ?? '');
  });

  // V6 選了上鎖方式但在設定頁取消（Esc）→ 上鎖自動關回去
  test('V6 cancelling lock config turns lock off', async ({ page }) => {
    const lockSwitch = page.getByTestId('list-lock-switch');
    await lockSwitch.click();
    await page.getByTestId('lock-type-password').click();
    await expect(page.getByTestId('lock-config-done')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('lock-config-done')).toBeHidden();
    await expect(lockSwitch).not.toBeChecked();
  });
});
