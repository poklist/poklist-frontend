import { createResponseSchema } from '@/api/schemas/common';
import { Category } from '@/enums/Lists/index.enum';
import z from 'zod';

const getCategoriesSchema = createResponseSchema(
  z
    .object({
      id: z.nativeEnum(Category),
      name: z.string(),
    })
    .array()
);
export const categoriesSchema = {
  getResponse: getCategoriesSchema,
};
