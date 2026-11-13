import { listsSchema } from '@/api/schemas';
import { describe, expect, it } from 'vitest';

// NOTE: type: 1 corresponds to ListType.PUBLIC (src/enums/Lists/index.enum.ts).
// ListType only defines PUBLIC = 1 and PRIVATE = 2, so 0 is not a valid value.
const listResponseSample = {
  code: '0000',
  message: 'success',
  content: {
    id: '100',
    title: 'Public List',
    description: 'A public list',
    coverImage: '',
    externalLink: '',
    categoryID: 1,
    type: 1,
    likeCount: 1,
    isLiked: true,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ideas: [
      {
        id: '100-idea-1',
        title: 'Idea 1',
        description: '',
        coverImage: '',
        externalLink: '',
      },
    ],
    ideaTotalCount: 41,
    owner: {
      id: 1,
      displayName: 'User A',
      userCode: 'usera',
      profileImage: '',
    },
  },
  offset: 0,
  limit: 3,
  totalElements: 41,
};

describe('listsSchema.getResponse', () => {
  it('accepts a full list response', () => {
    expect(() =>
      listsSchema.getResponse.parse(listResponseSample)
    ).not.toThrow();
  });

  it('requires offset, limit and totalElements (infinite response)', () => {
    // Built explicitly (rather than destructuring-to-discard `offset`) so
    // `noUnusedLocals`/`no-unused-vars` stay satisfied.
    const withoutOffset = {
      code: listResponseSample.code,
      message: listResponseSample.message,
      content: listResponseSample.content,
      limit: listResponseSample.limit,
      totalElements: listResponseSample.totalElements,
    };
    expect(() => listsSchema.getResponse.parse(withoutOffset)).toThrow();
  });

  it('rejects a numeric id (all ids are strings)', () => {
    const bad = {
      ...listResponseSample,
      content: { ...listResponseSample.content, id: 100 },
    };
    expect(() => listsSchema.getResponse.parse(bad)).toThrow();
  });

  // Known type lie: the schema declares isLiked as a required boolean, but
  // SSR hydration strips it to undefined in practice. This test documents
  // that inconsistency — it is NOT asserting desired behaviour. If the
  // schema is ever changed to `.optional()` to match reality, this test
  // will fail and should be updated (see AGENTS.md §13, the isLiked /
  // isFollowing type lie).
  it('documents that the schema currently rejects undefined isLiked, even though hydration produces it', () => {
    const stripped = {
      ...listResponseSample,
      content: { ...listResponseSample.content, isLiked: undefined },
    };
    expect(() => listsSchema.getResponse.parse(stripped)).toThrow();
  });
});
