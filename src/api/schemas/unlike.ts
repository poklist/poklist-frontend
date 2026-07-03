import { createResponseSchema } from '@/api/schemas/common';
import z from 'zod';

const postUnlikeRequestSchema = z.object({ listID: z.string() });

const postUnlikeResponseSchema = createResponseSchema(z.unknown().nullable());

export const unlikeSchema = {
  postUnlikeRequest: postUnlikeRequestSchema,
  postUnlikeResponse: postUnlikeResponseSchema,
};
