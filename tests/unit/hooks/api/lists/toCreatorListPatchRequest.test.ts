import { GetCreatorListResponse } from '@/api/query/creatorLists';
import { creatorListsSchema } from '@/api/schemas';
import {
  CapacityLimitMode,
  ListLockMethod,
  ListType,
  LockConfigStatus,
} from '@/enums/Lists/index.enum';
import {
  hasLockHistory,
  toCreatorListPatchRequest,
  toListFormLock,
} from '@/hooks/api/lists/toCreatorListPatchRequest';
import { ListFormSchema } from '@/types/common';
import { describe, expect, it } from 'vitest';
import z from 'zod';

type Settings = GetCreatorListResponse['content'];

const capacity = {
  limitMode: CapacityLimitMode.UNLIMITED,
  limitCount: 0,
  usedCount: 2,
  remainingCount: null,
  isFull: false,
};

const noneSettings: Settings = {
  listID: 'list-1',
  title: '旅行清單',
  description: '',
  coverImage: 'https://image.relist.cc/a.png',
  externalLink: '',
  categoryID: 1,
  type: ListType.PUBLIC,
  method: ListLockMethod.NONE,
  editToken: 'mock-edit-token',
  password: null,
  question: null,
  answerSummary: { totalCount: 0, unreadCount: 0 },
};

const questionSettings: Settings = {
  ...noneSettings,
  method: ListLockMethod.QUESTION,
  question: {
    id: 'question-1',
    status: LockConfigStatus.ACTIVE,
    question: '你最想去哪裡？',
    createdAt: '2026-10-17T01:30:00Z',
    capacity,
  },
};

const passwordSettings: Settings = {
  ...noneSettings,
  method: ListLockMethod.PASSWORD,
  password: {
    id: 'password-1',
    status: LockConfigStatus.ACTIVE,
    password: 'mock-password',
    capacity,
  },
};

const formValues: z.infer<typeof ListFormSchema> = {
  title: '  新標題 ',
  description: '',
  externalLink: '',
  coverImage: null,
  categoryID: 0,
  type: ListType.PUBLIC,
  lock: { method: ListLockMethod.NONE },
  resetReadPermissions: false,
};

// JSON 才是實際送出的內容；undefined 欄位不會出現
const sent = (body: unknown): unknown => JSON.parse(JSON.stringify(body));

describe('toListFormLock', () => {
  it('maps each method to the form lock', () => {
    expect(toListFormLock(noneSettings)).toEqual({
      method: ListLockMethod.NONE,
    });
    expect(toListFormLock(passwordSettings)).toEqual({
      method: ListLockMethod.PASSWORD,
    });
    expect(toListFormLock(questionSettings)).toEqual({
      method: ListLockMethod.QUESTION,
      question: '你最想去哪裡？',
    });
  });
});

describe('hasLockHistory', () => {
  it('is false only when the list was never locked (BE §6)', () => {
    expect(hasLockHistory(noneSettings)).toBe(false);
  });

  it('is true for a list that is locked now', () => {
    expect(hasLockHistory(passwordSettings)).toBe(true);
    expect(hasLockHistory(questionSettings)).toBe(true);
  });

  it('is true for an unlocked list that still has an old lock config', () => {
    expect(
      hasLockHistory({ ...passwordSettings, method: ListLockMethod.NONE })
    ).toBe(true);
    expect(
      hasLockHistory({ ...questionSettings, method: ListLockMethod.NONE })
    ).toBe(true);
  });
});

describe('toCreatorListPatchRequest', () => {
  it('sends basic fields without lock when the lock is unchanged (BE §7)', () => {
    const body = toCreatorListPatchRequest(formValues, noneSettings);
    expect(sent(body)).toEqual({
      editToken: 'mock-edit-token',
      title: '新標題',
      description: '',
      externalLink: '',
      type: ListType.PUBLIC,
    });
    expect(creatorListsSchema.patchRequest.safeParse(body).success).toBe(true);
  });

  it('sends an empty coverImage to clear it', () => {
    const body = toCreatorListPatchRequest(
      { ...formValues, coverImage: '', categoryID: 3 },
      noneSettings
    );
    expect(body.coverImage).toBe('');
    expect(body.categoryID).toBe(3);
  });

  it('sends lock with resetReadPermissions when the method changed', () => {
    const body = toCreatorListPatchRequest(
      { ...formValues, resetReadPermissions: true },
      passwordSettings
    );
    expect(body.lock).toEqual({
      method: ListLockMethod.NONE,
      resetReadPermissions: true,
    });
    expect(creatorListsSchema.patchRequest.safeParse(body).success).toBe(true);
  });

  it('sends the trimmed question when the question changed', () => {
    const body = toCreatorListPatchRequest(
      {
        ...formValues,
        lock: { method: ListLockMethod.QUESTION, question: ' 下一趟去哪？ ' },
      },
      questionSettings
    );
    expect(body.lock).toEqual({
      method: ListLockMethod.QUESTION,
      question: '下一趟去哪？',
      resetReadPermissions: false,
    });
  });

  it('sends the question when switching to the question method', () => {
    const body = toCreatorListPatchRequest(
      {
        ...formValues,
        lock: { method: ListLockMethod.QUESTION, question: '你最想去哪裡？' },
      },
      passwordSettings
    );
    expect(body.lock).toEqual({
      method: ListLockMethod.QUESTION,
      question: '你最想去哪裡？',
      resetReadPermissions: false,
    });
  });

  it('omits lock when only surrounding spaces of the question changed', () => {
    const body = toCreatorListPatchRequest(
      {
        ...formValues,
        lock: { method: ListLockMethod.QUESTION, question: ' 你最想去哪裡？ ' },
      },
      questionSettings
    );
    expect(sent(body)).not.toHaveProperty('lock');
  });

  it('ignores a leftover question config when the method is none', () => {
    const body = toCreatorListPatchRequest(formValues, {
      ...questionSettings,
      method: ListLockMethod.NONE,
    });
    expect(sent(body)).not.toHaveProperty('lock');
  });

  it('sends the original method when only resetting read permissions', () => {
    const body = toCreatorListPatchRequest(
      {
        ...formValues,
        lock: { method: ListLockMethod.PASSWORD },
        resetReadPermissions: true,
      },
      passwordSettings
    );
    expect(body.lock).toEqual({
      method: ListLockMethod.PASSWORD,
      resetReadPermissions: true,
    });
    expect(creatorListsSchema.patchRequest.safeParse(body).success).toBe(true);
  });

  it('omits the unchanged question when only resetting read permissions', () => {
    const body = toCreatorListPatchRequest(
      {
        ...formValues,
        lock: { method: ListLockMethod.QUESTION, question: '你最想去哪裡？' },
        resetReadPermissions: true,
      },
      questionSettings
    );
    expect(sent(body)).toHaveProperty('lock', {
      method: ListLockMethod.QUESTION,
      resetReadPermissions: true,
    });
    expect(creatorListsSchema.patchRequest.safeParse(body).success).toBe(true);
  });
});

describe('ListFormSchema', () => {
  it('defaults resetReadPermissions to false for old drafts', () => {
    const oldDraft: Omit<typeof formValues, 'resetReadPermissions'> = {
      title: '旅行清單',
      description: '',
      externalLink: '',
      coverImage: null,
      categoryID: 0,
      type: ListType.PUBLIC,
      lock: { method: ListLockMethod.NONE },
    };
    expect(ListFormSchema.parse(oldDraft).resetReadPermissions).toBe(false);
  });
});
