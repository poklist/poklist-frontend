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

  // debounce flush 的判斷依據：兩值相同代表無需送 API
  it('signals no-op when optimistic matches confirmed', () => {
    useLikeStore.getState().setConfirmedIsLiked('100', true);
    useLikeStore.getState().setIsLiked('100', true);

    const state = useLikeStore.getState();
    expect(state.getIsLiked('100')).toBe(state.getConfirmedIsLiked('100'));
  });

  it('reports whether a confirmed state exists', () => {
    expect(useLikeStore.getState().hasConfirmedLikeState('100')).toBe(false);
    useLikeStore.getState().setConfirmedIsLiked('100', true);
    expect(useLikeStore.getState().hasConfirmedLikeState('100')).toBe(true);
  });
});

describe('useLikeStore clearing', () => {
  it('clears a single list', () => {
    useLikeStore.getState().setIsLiked('100', true);
    useLikeStore.getState().setIsLiked('101', true);
    useLikeStore.getState().clearLikeStatus('100');

    expect(useLikeStore.getState().hasLikeState('100')).toBe(false);
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
