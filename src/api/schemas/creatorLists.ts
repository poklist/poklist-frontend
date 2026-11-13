import { createResponseSchema } from '@/api/schemas/common';
import {
  CapacityLimitMode,
  ListLockMethod,
  ListType,
  LockConfigStatus,
} from '@/enums/Lists/index.enum';
import { ListLockSchema, LockQuestionSchema } from '@/types/common';
import z from 'zod';

// 新的 /creator/lists API（docs/api/2026-10-17-list-lock-mock.md）。
// BE 的 request 不接受 null 或未定義欄位（§3），所以 request schema 用 strict。

// 全部 POST／PATCH 都要帶；一次使用者操作一個 key，重送同一份內容沿用原 key（§1）
const idempotencyHeadersSchema = z.object({
  'idempotency-key': z.string().min(1),
});

const listParamsSchema = z.object({ listID: z.string() });

// §3 共用名額欄位
const capacitySchema = z.object({
  limitMode: z.nativeEnum(CapacityLimitMode),
  limitCount: z.number().int().nonnegative(),
  usedCount: z.number().int().nonnegative(),
  remainingCount: z.number().int().nonnegative().nullable(),
  isFull: z.boolean(),
});

// §5 建立名單
const postRequestSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    externalLink: z.string().optional(),
    categoryID: z.number().int().positive().optional(),
    type: z.nativeEnum(ListType).optional(),
    lock: ListLockSchema.optional(),
  })
  .strict();

// 建立只回 lock.method 摘要；完整題目／系統密碼要用 GET 編輯設定取得
const postResponseSchema = createResponseSchema(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    coverImage: z.string(),
    externalLink: z.string(),
    categoryID: z.number(),
    type: z.nativeEnum(ListType),
    editToken: z.string(),
    lock: z.object({ method: z.nativeEnum(ListLockMethod) }),
  })
);

// §6 取得名單編輯設定；和 GET /lists/:id 的 DTO 不同，不共用解析
const getResponseSchema = createResponseSchema(
  z.object({
    listID: z.string(),
    title: z.string(),
    description: z.string(),
    coverImage: z.string(),
    externalLink: z.string(),
    categoryID: z.number(),
    type: z.nativeEnum(ListType),
    method: z.nativeEnum(ListLockMethod),
    editToken: z.string(),
    password: z
      .object({
        id: z.string(),
        status: z.nativeEnum(LockConfigStatus),
        password: z.string(),
        capacity: capacitySchema,
      })
      .nullable(),
    question: z
      .object({
        id: z.string(),
        status: z.nativeEnum(LockConfigStatus),
        question: z.string(),
        createdAt: z.string(),
        capacity: capacitySchema,
      })
      .nullable(),
    answerSummary: z.object({
      totalCount: z.number().int().nonnegative(),
      unreadCount: z.number().int().nonnegative(),
    }),
  })
);

// §7 lock 有提供時 resetReadPermissions 必填；question 方法可省略 question 沿用原題
const resetReadPermissionsSchema = z.boolean();
const patchLockSchema = z.discriminatedUnion('method', [
  z
    .object({
      method: z.literal(ListLockMethod.NONE),
      resetReadPermissions: resetReadPermissionsSchema,
    })
    .strict(),
  z
    .object({
      method: z.literal(ListLockMethod.PASSWORD),
      resetReadPermissions: resetReadPermissionsSchema,
    })
    .strict(),
  z
    .object({
      method: z.literal(ListLockMethod.QUESTION),
      question: LockQuestionSchema.optional(),
      resetReadPermissions: resetReadPermissionsSchema,
    })
    .strict(),
]);

// §7 更新名單：省略的欄位沿用，空字串清空
const patchRequestSchema = z
  .object({
    editToken: z.string().min(1),
    title: z.string().trim().min(1).optional(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    externalLink: z.string().optional(),
    categoryID: z.number().int().positive().optional(),
    type: z.nativeEnum(ListType).optional(),
    lock: patchLockSchema.optional(),
  })
  .strict();

// §8 密碼名額增加 10 人；不傳 amount／newLimitCount
const increaseCapacityParamsSchema = listParamsSchema.extend({
  passwordID: z.string(),
});

const increaseCapacityRequestSchema = z
  .object({ expectedLimitCount: z.number().int().nonnegative() })
  .strict();

const increaseCapacityResponseSchema = createResponseSchema(
  z.object({
    listID: z.string(),
    passwordID: z.string(),
    capacity: capacitySchema,
  })
);

export const creatorListsSchema = {
  idempotencyHeaders: idempotencyHeadersSchema,
  listParams: listParamsSchema,
  postRequest: postRequestSchema,
  postResponse: postResponseSchema,
  getResponse: getResponseSchema,
  patchRequest: patchRequestSchema,
  // §7：建立與更新的成功 response 外形相同
  patchResponse: postResponseSchema,
  increaseCapacityParams: increaseCapacityParamsSchema,
  increaseCapacityRequest: increaseCapacityRequestSchema,
  increaseCapacityResponse: increaseCapacityResponseSchema,
};
