import { createResponseSchema, userSchema } from '@/api/schemas/common';
import { IdeaFormSchema } from '@/types/common';

import z from 'zod';

export const ideaPreviewSchema = IdeaFormSchema.extend({
  id: z.string(),
});

const getRequestSchema = z.object({
  ideaID: z.string(),
});

const getResponseSchema = createResponseSchema(
  ideaPreviewSchema.extend({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    listID: z.string(),
    owner: userSchema,
  })
);

export const ideasSchema = {
  getRequest: getRequestSchema,
  getResponse: getResponseSchema,
};
