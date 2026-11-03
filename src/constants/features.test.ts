import { isFeatureOn } from '@/constants/features';
import { describe, expect, it } from 'vitest';

describe('isFeatureOn', () => {
  it('is on only for the exact string "true"', () => {
    expect(isFeatureOn('true')).toBe(true);
  });

  it('is off when unset or any other value (default off)', () => {
    expect(isFeatureOn(undefined)).toBe(false);
    expect(isFeatureOn('')).toBe(false);
    expect(isFeatureOn('false')).toBe(false);
    expect(isFeatureOn('TRUE')).toBe(false);
    expect(isFeatureOn('1')).toBe(false);
  });
});
