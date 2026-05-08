import { createResponseSchema } from '@/api/schemas/common';
import z from 'zod';

const getRequestSchema = z.object({ userID: z.number().int().nonnegative() });

const getFollowingsSchema = createResponseSchema(
  z
    .object({
      displayName: z.string(),
      id: z.number().nonnegative().int(),
      profileImage: z.string().optional(),
      userCode: z.string(),
      isFollowing: z.boolean(),
    })
    .array()
);

export const followingsSchema = {
  getRequest: getRequestSchema,
  getResponse: getFollowingsSchema,
};
