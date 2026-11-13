import { publishSchema } from '@/api/schemas';
import { describe, expect, it } from 'vitest';

describe('publishSchema.getListsLimitsResponse', () => {
  it('accepts a nullable remainingCount for unlimited users', () => {
    expect(() =>
      publishSchema.getListsLimitsResponse.parse({
        code: '0000',
        message: 'success',
        content: {
          usedCount: 3,
          limitCount: 0,
          remainingCount: null,
          isUnlimited: true,
        },
      })
    ).not.toThrow();
  });
});
