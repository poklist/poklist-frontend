import { computeNextOffset, sumFetched } from '@/hooks/api/ideas/offset';
import { describe, expect, it } from 'vitest';

describe('sumFetched', () => {
  it('sums page sizes', () => {
    expect(sumFetched([{ n: 20 }, { n: 20 }, { n: 1 }], (p) => p.n)).toBe(41);
  });

  it('returns 0 for no pages', () => {
    expect(sumFetched([], (p: { n: number }) => p.n)).toBe(0);
  });
});

describe('computeNextOffset', () => {
  it('returns accumulated offset after first page', () => {
    expect(computeNextOffset(20, 41, 20)).toBe(20);
  });

  // 這是原 bug：第 2 頁後若用 lastPage.length 會停在 20，第 3 頁抓到重複資料
  it('keeps advancing on the third page', () => {
    expect(computeNextOffset(40, 41, 20)).toBe(40);
  });

  it('returns undefined when all items fetched', () => {
    expect(computeNextOffset(41, 41, 1)).toBeUndefined();
  });

  it('returns undefined when fetched exceeds total', () => {
    expect(computeNextOffset(45, 41, 5)).toBeUndefined();
  });

  it('returns undefined when last page was empty', () => {
    expect(computeNextOffset(20, 41, 0)).toBeUndefined();
  });

  it('returns undefined when total is zero', () => {
    expect(computeNextOffset(0, 0, 0)).toBeUndefined();
  });
});
