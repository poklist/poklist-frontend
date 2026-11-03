import { PostCreatorListsRequest } from '@/api/query/creatorLists';
import { ListLockMethod } from '@/enums/Lists/index.enum';
import { ListFormSchema } from '@/types/common';
import z from 'zod';

// 表單值 → POST /creator/lists 的 body。BE 不接受 null、categoryID 要大於 0（§3、§5），
// 不使用的欄位設成 undefined，JSON 序列化時會被省略
export const toCreatorListPostRequest = (
  values: z.infer<typeof ListFormSchema>
): PostCreatorListsRequest => ({
  title: values.title.trim(),
  description: values.description,
  coverImage: values.coverImage ?? undefined,
  externalLink: values.externalLink,
  categoryID: values.categoryID > 0 ? values.categoryID : undefined,
  type: values.type,
  lock: values.lock.method === ListLockMethod.NONE ? undefined : values.lock,
});
