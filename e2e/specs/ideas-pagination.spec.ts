import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.use({ storageState: buildStorageState() });

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

// 必須與 e2e/mock-server/state.ts 中 list "100" 的 makeIdeas('100', 41) 一致。
// 兩處若不同步，本測試會以「捲動停滯」的形式失敗，看起來像分頁 regression。
const TOTAL_IDEAS = 41;

const collectIdeaIDs = async (page: import('@playwright/test').Page) =>
  page
    .locator('[data-testid="idea-row"]')
    .evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('data-idea-id') ?? '')
    );

// E5：limit=20、總數 41 → 需載入 3 頁。offset 若未累加，第 3 頁會重複第 2 頁內容。
test('E5 loads all ideas across three pages without duplicates or gaps', async ({
  page,
}) => {
  await page.goto('/usera/list/100');
  await expect(page.locator('[data-testid="idea-row"]').first()).toBeVisible();

  let previousCount = (await collectIdeaIDs(page)).length;
  while (previousCount < TOTAL_IDEAS) {
    // mouse.wheel is unsupported on mobile WebKit, so scroll the last
    // rendered row into view instead — this crosses the IntersectionObserver
    // sentinel the same way a real scroll would, on every engine.
    await page
      .locator('[data-testid="idea-row"]')
      .last()
      .scrollIntoViewIfNeeded();
    // Wait on the concrete condition (row count growing) instead of a fixed
    // sleep: infinite-scroll timing varies, but a stalled count after a
    // reasonable window means the next page genuinely never arrived.
    await expect
      .poll(async () => (await collectIdeaIDs(page)).length, { timeout: 5_000 })
      .toBeGreaterThan(previousCount);
    previousCount = (await collectIdeaIDs(page)).length;
  }

  const ids = await collectIdeaIDs(page);
  expect(ids).toHaveLength(TOTAL_IDEAS);
  expect(new Set(ids).size).toBe(TOTAL_IDEAS); // 無重複
  expect(ids).toContain(`100-idea-${TOTAL_IDEAS}`); // 無遺漏（最後一則）
});
