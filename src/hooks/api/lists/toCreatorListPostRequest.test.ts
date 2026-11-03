import { creatorListsSchema } from '@/api/schemas';
import { ListLockMethod, ListType } from '@/enums/Lists/index.enum';
import { toCreatorListPostRequest } from '@/hooks/api/lists/toCreatorListPostRequest';
import { ListFormSchema } from '@/types/common';
import { describe, expect, it } from 'vitest';
import z from 'zod';

const formValues: z.infer<typeof ListFormSchema> = {
  title: '  旅行清單 ',
  description: '',
  externalLink: '',
  coverImage: null,
  categoryID: 0,
  type: ListType.PUBLIC,
  lock: { method: ListLockMethod.NONE },
};

describe('toCreatorListPostRequest', () => {
  it('trims title, omits null coverImage, categoryID 0 and lock none', () => {
    const body = toCreatorListPostRequest(formValues);
    // JSON 才是實際送出的內容；undefined 欄位不會出現
    expect(JSON.parse(JSON.stringify(body))).toEqual({
      title: '旅行清單',
      description: '',
      externalLink: '',
      type: ListType.PUBLIC,
    });
    expect(JSON.stringify(body)).not.toContain('null');
  });

  it('keeps a selected category and the question lock', () => {
    const body = toCreatorListPostRequest({
      ...formValues,
      categoryID: 3,
      coverImage: 'https://image.relist.cc/a.png',
      lock: { method: ListLockMethod.QUESTION, question: '你最想去哪裡？' },
    });
    expect(body.categoryID).toBe(3);
    expect(body.coverImage).toBe('https://image.relist.cc/a.png');
    expect(body.lock).toEqual({
      method: ListLockMethod.QUESTION,
      question: '你最想去哪裡？',
    });
  });

  it('produces a body the strict request schema accepts', () => {
    const body = toCreatorListPostRequest({
      ...formValues,
      lock: { method: ListLockMethod.PASSWORD },
    });
    expect(creatorListsSchema.postRequest.safeParse(body).success).toBe(true);
  });
});

describe('creatorListsSchema', () => {
  it('rejects unknown fields and null (BE §3)', () => {
    expect(
      creatorListsSchema.postRequest.safeParse({ title: 't', ownerID: 1 })
        .success
    ).toBe(false);
    expect(
      creatorListsSchema.postRequest.safeParse({ title: 't', lock: null })
        .success
    ).toBe(false);
  });

  it('parses the documented create response (BE §5)', () => {
    expect(
      creatorListsSchema.postResponse.safeParse({
        code: '200',
        content: {
          categoryID: 1,
          coverImage: '',
          description: '',
          editToken: 'mock-edit-token',
          externalLink: '',
          id: '01K7M8T0H8D5GW9KR4N2P6C3W3',
          lock: { method: 'question' },
          title: '旅行清單',
          type: 1,
        },
        message: 'Success',
      }).success
    ).toBe(true);
  });
});
