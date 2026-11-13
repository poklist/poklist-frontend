import {
  DESC_MAX_LENGTH,
  LOCK_QUESTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from '@/constants/form';
import { ListLockMethod, ListType } from '@/enums/Lists/index.enum';
import { MessageType } from '@/enums/Style/index.enum';
import z from 'zod';

export type PartialRecord<K extends string | number | symbol, T> = {
  [P in K]?: T;
};
export interface FormErrorDetail {
  type: 'too_small' | 'too_big' | 'invalid';
  message?: string;
}
export interface ErrorMessage {
  drawer?: { title: string; content: string };
  toast?: { title: string; variant: MessageType };
}
// Form Error 結構
export type FormErrors = Record<string, FormErrorDetail>;

export const IdeaFormSchema = z.object({
  title: z.string().min(1).max(TITLE_MAX_LENGTH),
  description: z
    .string()
    .max(DESC_MAX_LENGTH)
    .transform((value) => {
      return value.replace(/^\s+/, ''); // 移除開頭所有空白
    })
    .optional(),
  externalLink: z
    .string()
    .trim()
    .transform((link) => {
      if (link === '') return link;
      if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return `https://${link}`;
      }
      return link;
    })
    .pipe(z.string().url().or(z.literal(''))),
  coverImage: z.string().nullable().optional().or(z.literal('')), // FUTURE: base64 check
  // .regex(
  //   /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/,
  //   "必須是有效的 Base64 圖片格式 (支援 jpg, png, webp, gif)"
  // )
  // .max(MAX_BASE64_LENGTH, "圖片檔案過大")
  // .transform((val) => (val === '' ? null : val));
});

// 舊 /lists API 與 idea/create/list 使用；不含 lock
export const ListBaseSchema = IdeaFormSchema.extend({
  categoryID: z.number().nonnegative(),
  type: z.nativeEnum(ListType),
});

// 去首尾空白後 1～60 個 Unicode code point（BE §5、§7）
export const LockQuestionSchema = z
  .string()
  .trim()
  .refine((question) => {
    const length = [...question].length;
    return length >= 1 && length <= LOCK_QUESTION_MAX_LENGTH;
  });

// 規則依 docs/api/2026-10-17-list-lock-mock.md §5
export const ListLockSchema = z.discriminatedUnion('method', [
  z.object({ method: z.literal(ListLockMethod.NONE) }),
  z.object({ method: z.literal(ListLockMethod.PASSWORD) }),
  z.object({
    method: z.literal(ListLockMethod.QUESTION),
    question: LockQuestionSchema,
  }),
]);

// list Form 使用；default 讓沒有 lock / resetReadPermissions 的舊草稿仍可讀取。
// resetReadPermissions 只給編輯的 PATCH 用（BE §7）：false 保留已解鎖的讀者、true 重置
export const ListFormSchema = ListBaseSchema.extend({
  lock: ListLockSchema.default({ method: ListLockMethod.NONE }),
  resetReadPermissions: z.boolean().default(false),
});
