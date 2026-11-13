import { usersSchema } from '@/api/schemas';
import { describe, expect, it } from 'vitest';

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
