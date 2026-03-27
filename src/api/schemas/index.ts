import z from 'zod';

export const commonResponseSchema = z.object({
  code: z.string().regex(/^\d+$/),
  message: z.string(),
  content: z.object({}).passthrough(),
  offset: z.number().nullish(),
  limit: z.number().nullish(),
  totalElements: z.number().nullish(),
});
