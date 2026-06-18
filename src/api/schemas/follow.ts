import { createResponseSchema } from '@/api/schemas/common';
import z from 'zod';

const postFollowRequestSchema = z.object({
  userID: z.number().int().nonnegative(),
});

const postFollowResponseSchema = createResponseSchema(z.null());

export const followSchema = {
  postFollowRequest: postFollowRequestSchema,
  postFollowResponse: postFollowResponseSchema,
};
