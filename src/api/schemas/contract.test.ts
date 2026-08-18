import {
  ideasSchema,
  listsSchema,
  publishSchema,
  usersSchema,
} from '@/api/schemas';
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
  // will fail and should be updated (see §13 of the test-infrastructure plan).
  it('documents that the schema currently rejects undefined isLiked, even though hydration produces it', () => {
    const stripped = {
      ...listResponseSample,
      content: { ...listResponseSample.content, isLiked: undefined },
    };
    expect(() => listsSchema.getResponse.parse(stripped)).toThrow();
  });
});

describe('ideasSchema.getIdeasUnderListResponse', () => {
  it('accepts an ideas payload', () => {
    expect(() =>
      ideasSchema.getIdeasUnderListResponse.parse({
        ideas: [
          {
            id: 'i1',
            title: 'T',
            description: '',
            coverImage: '',
            externalLink: '',
          },
        ],
        ideaTotalCount: 1,
      })
    ).not.toThrow();
  });

  it('accepts an empty ideas array', () => {
    expect(() =>
      ideasSchema.getIdeasUnderListResponse.parse({
        ideas: [],
        ideaTotalCount: 0,
      })
    ).not.toThrow();
  });

  it('rejects a negative total', () => {
    expect(() =>
      ideasSchema.getIdeasUnderListResponse.parse({
        ideas: [],
        ideaTotalCount: -1,
      })
    ).toThrow();
  });
});

describe('usersSchema.getInfoResponse', () => {
  const sample = {
    code: '0000',
    message: 'success',
    content: {
      id: 1,
      displayName: 'User A',
      userCode: 'usera',
      profileImage: '',
      listCount: 2,
      followerCount: 0,
      followingCount: 1,
      isFollowing: false,
    },
  };

  it('accepts a full user info response', () => {
    expect(() => usersSchema.getInfoResponse.parse(sample)).not.toThrow();
  });

  it('treats isFollowing as optional', () => {
    // Built explicitly (rather than destructuring-to-discard `isFollowing`)
    // so `noUnusedLocals`/`no-unused-vars` stay satisfied.
    const content = {
      id: sample.content.id,
      displayName: sample.content.displayName,
      userCode: sample.content.userCode,
      profileImage: sample.content.profileImage,
      listCount: sample.content.listCount,
      followerCount: sample.content.followerCount,
      followingCount: sample.content.followingCount,
    };
    expect(() =>
      usersSchema.getInfoResponse.parse({ ...sample, content })
    ).not.toThrow();
  });

  it('requires listCount', () => {
    const content = {
      id: sample.content.id,
      displayName: sample.content.displayName,
      userCode: sample.content.userCode,
      profileImage: sample.content.profileImage,
      followerCount: sample.content.followerCount,
      followingCount: sample.content.followingCount,
      isFollowing: sample.content.isFollowing,
    };
    expect(() =>
      usersSchema.getInfoResponse.parse({ ...sample, content })
    ).toThrow();
  });
});

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
