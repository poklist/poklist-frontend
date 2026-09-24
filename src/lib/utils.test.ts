import { cn } from '@/lib/utils';
import { describe, expect, it } from 'vitest';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });

  it('lets later tailwind classes win', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
