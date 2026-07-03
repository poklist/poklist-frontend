import { createResponseSchema } from '@/api/schemas/common';
import z from 'zod';

const postLikeRequestSchema = z.object({ listID: z.string() });

const postLikeResponseSchema = createResponseSchema(z.unknown().nullable());

export const likeSchema = {
  postLikeRequest: postLikeRequestSchema,
  postLikeResponse: postLikeResponseSchema,
};
