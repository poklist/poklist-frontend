import { createResponseSchema, socialLinkSchema } from '@/api/schemas/common';
import z from 'zod';

const getRequestSchema = z.object({ userID: z.number().int().nonnegative() });

const getFollowersSchema = createResponseSchema(socialLinkSchema.array());

export const followersSchema = {
  getRequest: getRequestSchema,
  getResponse: getFollowersSchema,
};
