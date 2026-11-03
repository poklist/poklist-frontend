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

  // V1 開啟上鎖 → 同時選取「公開」並跳出上鎖方式 drawer；按「完成」前開關維持「關」
  test('V1 turning lock on selects public', async ({ page }) => {
    await page.getByTestId('list-visibility-private').click();
    await page.getByTestId('list-lock-switch').click();
    await expect(page.getByTestId('list-visibility-public')).toBeChecked();
    await expect(page.getByTestId('lock-type-password')).toBeVisible();
    await expect(page.getByTestId('list-lock-switch')).not.toBeChecked();
  });

  // V2 點「公開」區塊 → 選取「公開」
  test('V2 clicking public card selects public', async ({ page }) => {
    await page.getByTestId('list-visibility-private').click();
    await cardOf(page, 'list-visibility-public').click();
    await expect(page.getByTestId('list-visibility-public')).toBeChecked();
  });

  // V3 點「設定上鎖」區塊 → 跳出上鎖方式 drawer（開關仍為「關」）；未選方式就關閉 → 開關維持「關」
  test('V3 dismissing lock type drawer turns lock off', async ({ page }) => {
    const lockSwitch = page.getByTestId('list-lock-switch');
    await cardOf(page, 'list-lock-switch').click();
    await expect(page.getByTestId('lock-type-password')).toBeVisible();
    await expect(lockSwitch).not.toBeChecked();
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

  // V7 問答題目：空白、只有空白、超過 60 字時無法儲存；字數以去掉首尾空白後的 code point 計算
  test('V7 question must be 1-60 code points to save', async ({ page }) => {
    await page.getByTestId('list-lock-switch').click();
    await page.getByTestId('lock-type-question').click();
    const done = page.getByTestId('lock-config-done');
    const input = page.getByTestId('lock-question-input');
    const count = page.getByTestId('lock-question-count');
    await expect(done).toBeDisabled();
    await input.fill('   ');
    await expect(count).toHaveText('0/60');
    await expect(done).toBeDisabled();
    // 61 個 emoji：UTF-16 長度 122，code point 61
    await input.fill('😀'.repeat(61));
    await expect(count).toHaveText('61/60');
    await expect(done).toBeDisabled();
    await input.fill(`  ${'😀'.repeat(60)}  `);
    await expect(count).toHaveText('60/60');
    await expect(done).toBeEnabled();
  });

  // V8 問答設定完成 → 開關變「開」，草稿裡的 lock 為去掉首尾空白後的題目
  test('V8 saving question config writes lock into the form', async ({
    page,
  }) => {
    await page.getByTestId('list-title-input').fill('Locked List');
    const lockSwitch = page.getByTestId('list-lock-switch');
    await lockSwitch.click();
    await page.getByTestId('lock-type-question').click();
    await page.getByTestId('lock-question-input').fill('  你最想去哪裡？ ');
    await page.getByTestId('lock-config-done').click();
    await expect(page.getByTestId('lock-config-done')).toBeHidden();
    await expect(lockSwitch).toBeChecked();
    // useIdle 閒置 2 秒後把表單寫進 LIST_DRAFT，用它檢查 form 的 lock 值
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const raw = localStorage.getItem('list_draft');
            return raw ? (JSON.parse(raw) as { lock?: unknown }).lock : null;
          }),
        { timeout: 5000 }
      )
      .toEqual({ method: 'question', question: '你最想去哪裡？' });
  });

  // V9 還原草稿 → 上鎖設定一併還原
  test('V9 restoring a draft restores lock', async ({ page }) => {
    await page.getByTestId('list-title-input').fill('Locked Draft');
    await page.getByTestId('list-lock-switch').click();
    await page.getByTestId('lock-type-password').click();
    await page.getByTestId('lock-config-done').click();
    await page.waitForTimeout(2500);
    await page.reload();
    await page.getByTestId('draft-keep').click();
    await expect(page.getByTestId('list-lock-switch')).toBeChecked();
    await expect(page.getByTestId('list-visibility-public')).toBeChecked();
  });

  // V10 還原草稿 → 公開／隱藏一併還原
  test('V10 restoring a draft restores private type', async ({ page }) => {
    await page.getByTestId('list-title-input').fill('Private Draft');
    await page.getByTestId('list-visibility-private').click();
    await page.waitForTimeout(2500);
    await page.reload();
    await page.getByTestId('draft-keep').click();
    await expect(page.getByTestId('list-visibility-private')).toBeChecked();
    await expect(page.getByTestId('list-lock-switch')).not.toBeChecked();
  });
});
