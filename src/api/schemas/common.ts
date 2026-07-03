import z from 'zod';

export const userBriefSchema = z.object({
  id: z.number().int().nonnegative(),
  displayName: z.string(),
  userCode: z.string(),
  profileImage: z.string().base64().or(z.literal('')), // FUTURE: base64 check
});

export const socialLinkSchema = z.object({
  displayName: z.string(),
  id: z.number().nonnegative().int(),
  profileImage: z.string().optional(),
  userCode: z.string(),
  isFollowing: z.boolean(),
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
    error: z.unknown().nullish(),
  });

export const createInfiniteResponseSchema = <T extends z.ZodTypeAny>(
  contentSchema: T
) =>
  z.object({
    code: z.string().regex(/^\d+$/),
    message: z.string(),
    content: contentSchema,
    offset: z.number(),
    limit: z.number(),
    totalElements: z.number(),
  });
