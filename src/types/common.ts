import { DESC_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/constants/form';
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
  description: z.string().max(DESC_MAX_LENGTH).optional(),
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
  coverImage: z.string().or(z.literal('')).nullable().optional(), // FUTURE: base64 check
});

export const ListFormSchema = IdeaFormSchema.extend({
  categoryID: z.number().nonnegative(),
});
