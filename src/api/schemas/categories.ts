import { Category } from '@/enums/Lists/index.enum';
import z from 'zod';
import { commonResponseSchema } from '.';

const getResponseSchema = z
  .object({
    ...commonResponseSchema.shape,
    content: z.object({
      id: z.nativeEnum(Category), name: z.string()
    }).array()
  })
  ;

export const categoriesSchema = {
  getResponse: getResponseSchema,
};
