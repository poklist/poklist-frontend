export const toTsRestEntry = <T>(body: T) => ({
  status: 200 as const,
  body,
  headers: new Headers(), // dehydrate 後序列化為 {}，client 不讀 cache headers
});
