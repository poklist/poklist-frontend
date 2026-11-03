import { createResponseSchema } from '@/api/schemas/common';
import { ListLockMethod, ListType } from '@/enums/Lists/index.enum';
import { ListLockSchema } from '@/types/common';
import z from 'zod';

// 新的 /creator/lists API（docs/api/2026-10-17-list-lock-mock.md）。
// BE 的 request 不接受 null 或未定義欄位（§3），所以 request schema 用 strict。

// 全部 POST／PATCH 都要帶；一次使用者操作一個 key，重送同一份內容沿用原 key（§1）
const idempotencyHeadersSchema = z.object({
  'idempotency-key': z.string().min(1),
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

// 建立只回 lock.method 摘要；完整題目／系統密碼要用 GET 編輯設定取得（階段 5）
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

export const creatorListsSchema = {
  idempotencyHeaders: idempotencyHeadersSchema,
  postRequest: postRequestSchema,
  postResponse: postResponseSchema,
};
