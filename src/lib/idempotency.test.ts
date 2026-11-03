import { resolveIdempotencyKey } from '@/lib/idempotency';
import { describe, expect, it } from 'vitest';

describe('resolveIdempotencyKey', () => {
  let count = 0;
  const createKey = () => `key-${++count}`;

  it('creates a key for the first attempt', () => {
    expect(resolveIdempotencyKey(undefined, '{"a":1}', createKey)).toEqual({
      payload: '{"a":1}',
      key: 'key-1',
    });
  });

  it('reuses the key when the same payload is sent again', () => {
    const previous = { payload: '{"a":1}', key: 'key-1' };
    expect(resolveIdempotencyKey(previous, '{"a":1}', createKey)).toBe(
      previous
    );
  });

  it('creates a new key when the payload changed', () => {
    const previous = { payload: '{"a":1}', key: 'key-1' };
    expect(resolveIdempotencyKey(previous, '{"a":2}', createKey).key).toBe(
      'key-2'
    );
  });
});
