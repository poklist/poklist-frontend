import { createResponseSchema, userBriefSchema } from '@/api/schemas/common';
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
    owner: userBriefSchema,
  })
);

const postRequestSchema = IdeaFormSchema.extend({ listID: z.string() });

const postResponseSchema = createResponseSchema(
  postRequestSchema.extend({ id: z.string() })
);

const deleteRequestSchema = z.object({ ideaID: z.string() });

const deleteResponseSchema = z.unknown();

export const ideasSchema = {
  getRequest: getRequestSchema,
  getResponse: getResponseSchema,
  postRequest: postRequestSchema,
  postResponse: postResponseSchema,
  deleteRequest: deleteRequestSchema,
  deleteResponse: deleteResponseSchema,
};
