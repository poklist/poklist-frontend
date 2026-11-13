import {
  GetCreatorListResponse,
  PatchCreatorListRequest,
} from '@/api/query/creatorLists';
import { ListLockMethod } from '@/enums/Lists/index.enum';
import { ListFormSchema, ListLockSchema } from '@/types/common';
import z from 'zod';

type ListLock = z.infer<typeof ListLockSchema>;
type CreatorListSettings = GetCreatorListResponse['content'];

// GET 編輯設定（§6）→ form 的 lock。method 以 content.method 為準，題目只在 question 方法時帶
export const toListFormLock = (settings: CreatorListSettings): ListLock =>
  settings.method === ListLockMethod.QUESTION
    ? {
        method: ListLockMethod.QUESTION,
        question: settings.question?.question ?? '',
      }
    : { method: settings.method };

// 名單是否上過鎖（§6）：從未上鎖的名單 method 是 none，password、question 都是 null
export const hasLockHistory = (settings: CreatorListSettings): boolean =>
  settings.method !== ListLockMethod.NONE ||
  settings.password !== null ||
  settings.question !== null;

const questionOf = (lock: ListLock) =>
  lock.method === ListLockMethod.QUESTION ? lock.question.trim() : undefined;

// 表單值 → PATCH /creator/lists/:listId 的 body（§7）。基本欄位全送；BE 不接受 null、
// categoryID 要大於 0，這兩種不送＝沿用。
// lock 在方法改變、題目改變，或選了重置資格時送，送時附 resetReadPermissions。
// question 只在題目改變時放；沒變就省略，BE 會沿用原題
export const toCreatorListPatchRequest = (
  values: z.infer<typeof ListFormSchema>,
  original: CreatorListSettings
): PatchCreatorListRequest => {
  const { resetReadPermissions } = values;
  const originalLock = toListFormLock(original);
  const question = questionOf(values.lock);
  const isQuestionChanged = question !== questionOf(originalLock);
  const isLockSent =
    values.lock.method !== originalLock.method ||
    isQuestionChanged ||
    resetReadPermissions;

  return {
    editToken: original.editToken,
    title: values.title.trim(),
    description: values.description,
    coverImage: values.coverImage ?? undefined,
    externalLink: values.externalLink,
    categoryID: values.categoryID > 0 ? values.categoryID : undefined,
    type: values.type,
    lock: !isLockSent
      ? undefined
      : question !== undefined && isQuestionChanged
        ? { method: ListLockMethod.QUESTION, question, resetReadPermissions }
        : { method: values.lock.method, resetReadPermissions },
  };
};
