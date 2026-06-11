import { createResponseSchema } from '@/api/schemas/common';
import z from 'zod';

const postUnfollowRequestSchema = z.object({ userID: z.string() });

const postUnfollowResponseSchema = createResponseSchema(z.null());

export const unfollowSchema = {
  postUnfollowRequest: postUnfollowRequestSchema,
  postUnfollowResponse: postUnfollowResponseSchema,
};
