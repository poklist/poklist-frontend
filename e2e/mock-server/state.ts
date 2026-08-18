export interface MockIdea {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
}

export interface MockList {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
  categoryID: number;
  // Must match src/enums/Lists/index.enum.ts ListType: PUBLIC = 1, PRIVATE = 2.
  // Do NOT invent a local 0/1 convention — the frontend compares against that enum,
  // so a mismatched value silently disables private-list UI (e.g. the private icon).
  type: number;
  likeCount: number;
  likedBy: Set<string>;
  createdAt: string;
  updatedAt: string;
  ownerUserCode: string;
  ideas: MockIdea[];
}

export interface MockUser {
  id: number;
  displayName: string;
  userCode: string;
  profileImage: string;
  listCount: number;
  followerCount: number;
  followingCount: number;
  followedBy: Set<string>;
}

export interface MockState {
  users: Map<string, MockUser>;
  lists: Map<string, MockList>;
}

const makeIdeas = (listID: string, count: number): MockIdea[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${listID}-idea-${i + 1}`,
    title: `Idea ${i + 1}`,
    description: `Description for idea ${i + 1}`,
    coverImage: '',
    externalLink: '',
  }));

const buildInitialState = (): MockState => {
  const users = new Map<string, MockUser>();
  users.set('usera', {
    id: 1,
    displayName: 'User A',
    userCode: 'usera',
    profileImage: '',
    listCount: 2,
    followerCount: 0,
    followingCount: 1,
    followedBy: new Set<string>(),
  });
  users.set('userb', {
    id: 2,
    displayName: 'User B',
    userCode: 'userb',
    profileImage: '',
    listCount: 0,
    followerCount: 1,
    followingCount: 0,
    followedBy: new Set<string>(['usera']),
  });

  const lists = new Map<string, MockList>();
  lists.set('100', {
    id: '100',
    title: 'Public List',
    description: 'A public list',
    coverImage: '',
    externalLink: '',
    categoryID: 1,
    type: 1,
    likeCount: 1,
    likedBy: new Set<string>(['usera']),
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ownerUserCode: 'usera',
    ideas: makeIdeas('100', 41),
  });
  lists.set('101', {
    id: '101',
    title: 'Private List',
    description: 'A private list',
    coverImage: '',
    externalLink: '',
    categoryID: 1,
    type: 2,
    likeCount: 0,
    likedBy: new Set<string>(),
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ownerUserCode: 'usera',
    ideas: makeIdeas('101', 3),
  });
  // userb 的 public list —— follow 按鈕只在「非自己的 list」顯示，
  // 所以 follow 汙染測試必須用別人的 list 才有按鈕可斷言。
  lists.set('102', {
    id: '102',
    title: 'User B List',
    description: "User B's public list",
    coverImage: '',
    externalLink: '',
    categoryID: 1,
    type: 1,
    likeCount: 0,
    likedBy: new Set<string>(),
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ownerUserCode: 'userb',
    ideas: makeIdeas('102', 2),
  });

  return { users, lists };
};

let state: MockState = buildInitialState();

export const getState = (): MockState => state;
export const resetState = (): void => {
  state = buildInitialState();
};
