import { createResponseSchema, socialLinkSchema } from '@/api/schemas/common';
import z from 'zod';

const getRequestSchema = z.object({ userID: z.number().int().nonnegative() });

const getFollowingsSchema = createResponseSchema(socialLinkSchema.array());

export const followingsSchema = {
  getRequest: getRequestSchema,
  getResponse: getFollowingsSchema,
};
