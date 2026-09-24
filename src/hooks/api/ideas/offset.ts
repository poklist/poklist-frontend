/** 累加已取得的項目數。infinite query 的 offset 必須用累計值，不能用最後一頁的長度。 */
export const sumFetched = <T>(
  pages: T[],
  sizeOf: (page: T) => number
): number => pages.reduce((sum, page) => sum + sizeOf(page), 0);

/**
 * 計算下一頁 offset。回傳 undefined 代表沒有下一頁。
 * @param totalFetched 已取得的累計項目數
 * @param total 伺服器回報的總數
 * @param lastPageSize 最後一頁的項目數（為 0 代表已到底）
 */
export const computeNextOffset = (
  totalFetched: number,
  total: number,
  lastPageSize: number
): number | undefined => {
  if (lastPageSize === 0) return undefined;
  if (totalFetched >= total) return undefined;
  return totalFetched;
};
