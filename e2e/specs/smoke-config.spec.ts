import { expect, test } from '@playwright/test';

test('app loads on mobile UA without redirecting to goToMobile', async ({
  page,
}) => {
  await page.goto('/discovery');
  await expect(page).not.toHaveURL(/goToMobile/);
});

test('mock api serves list payload', async ({ request }) => {
  const res = await request.get(
    'http://localhost:4000/lists/100?offset=0&limit=3'
  );
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.content.title).toBe('Public List');
  expect(body.totalElements).toBe(41);
});

test('mock api varies isLiked by Authorization header', async ({ request }) => {
  const anon = await (
    await request.get('http://localhost:4000/lists/100')
  ).json();
  expect(anon.content.isLiked).toBe(false);

  const authed = await (
    await request.get('http://localhost:4000/lists/100', {
      headers: { Authorization: 'Bearer e2e-fake-token' },
    })
  ).json();
  expect(authed.content.isLiked).toBe(true);
});
