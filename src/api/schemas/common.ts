import z from 'zod';

export const userSchema = z.object({
  id: z.number().int().nonnegative(),
  displayName: z.string(),
  userCode: z.string(),
  profileImage: z.string().base64(),
});

export const createResponseSchema = <T extends z.ZodTypeAny>(
  contentSchema: T
) =>
  z.object({
    code: z.string().regex(/^\d+$/),
    message: z.string(),
    content: contentSchema,
    offset: z.number().optional(),
    limit: z.number().optional(),
    totalElements: z.number().optional(),
  });
