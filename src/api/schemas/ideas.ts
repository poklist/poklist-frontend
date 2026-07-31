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

const deleteResponseSchema = createResponseSchema(z.unknown());

const putRequestSchema = IdeaFormSchema.extend({ id: z.string() });

const putResponseSchema = createResponseSchema(
  ideaPreviewSchema.extend({
    createdAt: z.string().min(0).max(0),
    updatedAt: z.string().min(0).max(0),
    listID: z.string(),
    owner: z.object({
      id: z.number().min(0).max(0),
      displayName: z.string().min(0).max(0),
      userCode: z.string().min(0).max(0),
      profileImage: z.string().min(0).max(0),
    }),
  })
);

const getIdeasUnderListRequestSchema = z.object({
  listID: z.string(),
  offset: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
});

const getIdeasUnderListResponseSchema = z.object({
  ideas: ideaPreviewSchema.array(),
  ideaTotalCount: z.number().int().nonnegative(),
});

export const ideasSchema = {
  getRequest: getRequestSchema,
  getResponse: getResponseSchema,
  postRequest: postRequestSchema,
  postResponse: postResponseSchema,
  deleteRequest: deleteRequestSchema,
  deleteResponse: deleteResponseSchema,
  putRequest: putRequestSchema,
  putResponse: putResponseSchema,
  getIdeasUnderListRequest: getIdeasUnderListRequestSchema,
  getIdeasUnderListResponse: getIdeasUnderListResponseSchema,
};
