import { canStillCreate } from '@/hooks/queries/publish/quota';
import { describe, expect, it } from 'vitest';

describe('canStillCreate', () => {
  it('allows unlimited users regardless of remainingCount', () => {
    expect(canStillCreate({ isUnlimited: true, remainingCount: 0 })).toBe(true);
  });

  it('allows unlimited users when remainingCount is null', () => {
    expect(canStillCreate({ isUnlimited: true, remainingCount: null })).toBe(
      true
    );
  });

  it('allows limited users with remaining quota', () => {
    expect(canStillCreate({ isUnlimited: false, remainingCount: 1 })).toBe(
      true
    );
  });

  it('blocks limited users with no quota left', () => {
    expect(canStillCreate({ isUnlimited: false, remainingCount: 0 })).toBe(
      false
    );
  });

  it('blocks limited users when remainingCount is null', () => {
    expect(canStillCreate({ isUnlimited: false, remainingCount: null })).toBe(
      false
    );
  });

  it('blocks limited users with a negative remainingCount', () => {
    expect(canStillCreate({ isUnlimited: false, remainingCount: -1 })).toBe(
      false
    );
  });
});
