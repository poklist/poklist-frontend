import { ListLockMethod, ListType } from '@/enums/Lists/index.enum';
import { ListBaseSchema, ListFormSchema, ListLockSchema } from '@/types/common';
import { describe, expect, it } from 'vitest';

const baseList = {
  title: 'title',
  externalLink: '',
  categoryID: 0,
  type: ListType.PUBLIC,
};

describe('ListLockSchema', () => {
  it('accepts none and password without extra fields', () => {
    expect(ListLockSchema.parse({ method: ListLockMethod.NONE })).toEqual({
      method: ListLockMethod.NONE,
    });
    expect(ListLockSchema.parse({ method: ListLockMethod.PASSWORD })).toEqual({
      method: ListLockMethod.PASSWORD,
    });
  });

  it('trims the question', () => {
    expect(
      ListLockSchema.parse({
        method: ListLockMethod.QUESTION,
        question: '  q ',
      })
    ).toEqual({ method: ListLockMethod.QUESTION, question: 'q' });
  });

  it('rejects a blank question', () => {
    expect(
      ListLockSchema.safeParse({
        method: ListLockMethod.QUESTION,
        question: '   ',
      }).success
    ).toBe(false);
  });

  it('counts the question length in code points (max 60)', () => {
    // 60 個 emoji：UTF-16 長度為 120，code point 為 60
    const emoji60 = '😀'.repeat(60);
    expect(
      ListLockSchema.safeParse({
        method: ListLockMethod.QUESTION,
        question: emoji60,
      }).success
    ).toBe(true);
    expect(
      ListLockSchema.safeParse({
        method: ListLockMethod.QUESTION,
        question: `${emoji60}😀`,
      }).success
    ).toBe(false);
  });

  it('requires question when method is question', () => {
    expect(
      ListLockSchema.safeParse({ method: ListLockMethod.QUESTION }).success
    ).toBe(false);
  });
});

describe('ListFormSchema', () => {
  it('defaults lock to none for drafts saved before lock existed', () => {
    expect(ListFormSchema.parse(baseList).lock).toEqual({
      method: ListLockMethod.NONE,
    });
  });
});

describe('ListBaseSchema', () => {
  it('does not carry lock (old /lists API)', () => {
    expect(
      ListBaseSchema.parse({
        ...baseList,
        lock: { method: ListLockMethod.PASSWORD },
      })
    ).not.toHaveProperty('lock');
  });
});
