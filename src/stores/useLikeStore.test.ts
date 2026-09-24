import useLikeStore from '@/stores/useLikeStore';
import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  useLikeStore.getState().clearAllLikeStatus();
});

describe('useLikeStore optimistic state', () => {
  it('reports no state before seeding', () => {
    expect(useLikeStore.getState().hasLikeState('100')).toBe(false);
  });

  // 已知取捨：未知態被塌縮為 false，本測試只記錄這個行為，不代表這是理想設計。
  // 若日後改為 boolean | undefined，本測試會提醒同步更新 ARCHITECTURE.md §13。
  it('documents that an unknown list collapses to false (not asserting this is ideal)', () => {
    expect(useLikeStore.getState().getIsLiked('100')).toBe(false);
  });

  it('stores and reads an optimistic value', () => {
    useLikeStore.getState().setIsLiked('100', true);
    expect(useLikeStore.getState().getIsLiked('100')).toBe(true);
    expect(useLikeStore.getState().hasLikeState('100')).toBe(true);
  });

  it('keeps per-list state independent', () => {
    useLikeStore.getState().setIsLiked('100', true);
    useLikeStore.getState().setIsLiked('101', false);
    expect(useLikeStore.getState().getIsLiked('100')).toBe(true);
    expect(useLikeStore.getState().getIsLiked('101')).toBe(false);
  });
});

describe('useLikeStore confirmed state (race-condition guard)', () => {
  it('tracks confirmed separately from optimistic', () => {
    useLikeStore.getState().setConfirmedIsLiked('100', false);
    useLikeStore.getState().setIsLiked('100', true);

    expect(useLikeStore.getState().getConfirmedIsLiked('100')).toBe(false);
    expect(useLikeStore.getState().getIsLiked('100')).toBe(true);
  });

  // useLikeAction 的 flush 守衛是 AND：
  //   hasConfirmedLikeState(id) && optimistic === getConfirmedIsLiked(id)
  // 因為 getConfirmedIsLiked 對未確認的 list 回傳 fallback false，
  // 「從未確認」與「確認為 false」的回傳值完全相同 —— 只有 hasConfirmedLikeState
  // 能區分。少了那個 clause，使用者載入頁面後的第一次 unlike（optimistic false）
  // 會被誤判為 no-op 而不送出 API。本測試釘住那個歧義。
  it('distinguishes never-confirmed from confirmed-false via hasConfirmedLikeState', () => {
    const before = useLikeStore.getState();
    expect(before.hasConfirmedLikeState('100')).toBe(false);
    expect(before.getConfirmedIsLiked('100')).toBe(false); // fallback，不代表已確認

    useLikeStore.getState().setConfirmedIsLiked('100', false);

    const after = useLikeStore.getState();
    expect(after.hasConfirmedLikeState('100')).toBe(true);
    expect(after.getConfirmedIsLiked('100')).toBe(false); // 同值，語意不同
  });

  it('reports whether a confirmed state exists', () => {
    expect(useLikeStore.getState().hasConfirmedLikeState('100')).toBe(false);
    useLikeStore.getState().setConfirmedIsLiked('100', true);
    expect(useLikeStore.getState().hasConfirmedLikeState('100')).toBe(true);
  });
});

describe('useLikeStore clearing', () => {
  // clearLikeStatus 同時刪 likeMap 與 confirmedLikeMap —— 只驗前者會讓
  // 「confirmed 殘留」的 regression 溜過去（與登出測試守的是同一個性質）
  it('clears a single list from both optimistic and confirmed maps', () => {
    useLikeStore.getState().setIsLiked('100', true);
    useLikeStore.getState().setConfirmedIsLiked('100', true);
    useLikeStore.getState().setIsLiked('101', true);
    useLikeStore.getState().clearLikeStatus('100');

    expect(useLikeStore.getState().hasLikeState('100')).toBe(false);
    expect(useLikeStore.getState().hasConfirmedLikeState('100')).toBe(false);
    expect(useLikeStore.getState().hasLikeState('101')).toBe(true);
  });

  // 這是登出時防止身分殘留的關鍵（resetIdentityCaches 會呼叫）
  it('clears every list on logout', () => {
    useLikeStore.getState().setIsLiked('100', true);
    useLikeStore.getState().setConfirmedIsLiked('100', true);
    useLikeStore.getState().clearAllLikeStatus();

    expect(useLikeStore.getState().hasLikeState('100')).toBe(false);
    expect(useLikeStore.getState().hasConfirmedLikeState('100')).toBe(false);
  });
});
