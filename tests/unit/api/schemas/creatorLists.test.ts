import { creatorListsSchema } from '@/api/schemas';
import { describe, expect, it } from 'vitest';

// 範例 JSON 照抄 docs/api/2026-10-17-list-lock-mock.md §6～8
const passwordSettings = {
  answerSummary: { totalCount: 0, unreadCount: 0 },
  categoryID: 1,
  coverImage: '',
  description: '',
  editToken: 'mock-edit-token',
  externalLink: '',
  listID: '01K7M8T0H8D5GW9KR4N2P6C3VZ',
  method: 'password',
  password: {
    capacity: {
      isFull: true,
      limitCount: 10,
      limitMode: 'limited',
      remainingCount: 0,
      usedCount: 10,
    },
    id: '01K7M8T0H8D5GW9KR4N2P6C3W1',
    password: 'mock-password',
    status: 'active',
  },
  question: null,
  title: '旅行清單',
  type: 1,
};

const questionSettings = {
  answerSummary: { totalCount: 3, unreadCount: 2 },
  categoryID: 1,
  coverImage: '',
  description: '',
  editToken: 'mock-edit-token',
  externalLink: '',
  listID: '01K7M8T0H8D5GW9KR4N2P6C3W3',
  method: 'question',
  password: null,
  question: {
    capacity: {
      isFull: false,
      limitCount: 0,
      limitMode: 'unlimited',
      remainingCount: null,
      usedCount: 2,
    },
    createdAt: '2026-10-17T01:30:00Z',
    id: '01K7M8T0H8D5GW9KR4N2P6C3W0',
    question: '你最想去哪裡？',
    status: 'active',
  },
  title: '旅行清單',
  type: 1,
};

const ok = (content: unknown) => ({ code: '200', message: 'Success', content });

describe('creatorListsSchema.getResponse (BE §6)', () => {
  it('parses the password and question list settings', () => {
    expect(
      creatorListsSchema.getResponse.safeParse(ok(passwordSettings)).success
    ).toBe(true);
    expect(
      creatorListsSchema.getResponse.safeParse(ok(questionSettings)).success
    ).toBe(true);
  });

  it('parses the unlocked list settings', () => {
    const noneSettings = {
      ...passwordSettings,
      method: 'none',
      password: null,
      question: null,
    };
    expect(
      creatorListsSchema.getResponse.safeParse(ok(noneSettings)).success
    ).toBe(true);
  });
});

describe('creatorListsSchema.patchRequest (BE §7)', () => {
  it('accepts the documented requests', () => {
    expect(
      creatorListsSchema.patchRequest.safeParse({
        description: '',
        editToken: 'mock-edit-token',
        lock: { method: 'none', resetReadPermissions: false },
        title: '更新標題',
      }).success
    ).toBe(true);
    expect(
      creatorListsSchema.patchRequest.safeParse({
        editToken: 'mock-edit-token',
        lock: {
          method: 'question',
          question: '下一趟旅行想去哪裡？',
          resetReadPermissions: false,
        },
      }).success
    ).toBe(true);
  });

  it('allows keeping the original question', () => {
    expect(
      creatorListsSchema.patchRequest.safeParse({
        editToken: 'mock-edit-token',
        lock: { method: 'question', resetReadPermissions: true },
      }).success
    ).toBe(true);
  });

  it('requires editToken and resetReadPermissions with lock', () => {
    expect(
      creatorListsSchema.patchRequest.safeParse({ title: 't' }).success
    ).toBe(false);
    expect(
      creatorListsSchema.patchRequest.safeParse({
        editToken: 'mock-edit-token',
        lock: { method: 'none' },
      }).success
    ).toBe(false);
  });

  it('rejects null and unknown fields (BE §3)', () => {
    expect(
      creatorListsSchema.patchRequest.safeParse({
        editToken: 'mock-edit-token',
        lock: null,
      }).success
    ).toBe(false);
    expect(
      creatorListsSchema.patchRequest.safeParse({
        editToken: 'mock-edit-token',
        ownerID: 1,
      }).success
    ).toBe(false);
  });

  it('parses the documented response', () => {
    expect(
      creatorListsSchema.patchResponse.safeParse(
        ok({
          categoryID: 1,
          coverImage: '',
          description: '',
          editToken: 'mock-edit-token',
          externalLink: '',
          id: '01K7M8T0H8D5GW9KR4N2P6C3VZ',
          lock: { method: 'none' },
          title: '更新標題',
          type: 1,
        })
      ).success
    ).toBe(true);
  });
});

describe('creatorListsSchema increase capacity (BE §8)', () => {
  it('accepts only expectedLimitCount', () => {
    expect(
      creatorListsSchema.increaseCapacityRequest.safeParse({
        expectedLimitCount: 10,
      }).success
    ).toBe(true);
    expect(
      creatorListsSchema.increaseCapacityRequest.safeParse({
        expectedLimitCount: 10,
        amount: 10,
      }).success
    ).toBe(false);
  });

  it('parses the documented response', () => {
    expect(
      creatorListsSchema.increaseCapacityResponse.safeParse(
        ok({
          capacity: {
            isFull: false,
            limitCount: 20,
            limitMode: 'limited',
            remainingCount: 10,
            usedCount: 10,
          },
          listID: '01K7M8T0H8D5GW9KR4N2P6C3VZ',
          passwordID: '01K7M8T0H8D5GW9KR4N2P6C3W1',
        })
      ).success
    ).toBe(true);
  });
});
