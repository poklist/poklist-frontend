import { createResponseSchema, userBriefSchema } from '@/api/schemas/common';
import { ideaPreviewSchema } from '@/api/schemas/ideas';
import { ListFormSchema } from '@/types/common';
import z from 'zod';

const getUserListsRequestSchema = z.object({
  userCode: z.string(),
  offset: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
});
export const listPreviewSchema = ListFormSchema.extend({
  id: z.string(),
});

const getUserListsResponseSchema = createResponseSchema(
  listPreviewSchema.array()
);

const getRequestSchema = z.object({
  listID: z.string(),
  offset: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
});

const getResponseSchema = createResponseSchema(
  listPreviewSchema.extend({
    likeCount: z.number().int().nonnegative(),
    isLiked: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    ideas: ideaPreviewSchema.array(),
    ideaTotalCount: z.number().int().nonnegative(),
    owner: userBriefSchema,
  })
);

const getIdeasOrderRequestSchema = z.object({ listID: z.string() });

const getIdeasOrderResponseSchema = createResponseSchema(z.array(z.string()));

export const listsSchema = {
  getRequest: getRequestSchema,
  getResponse: getResponseSchema,
  getUserListsRequest: getUserListsRequestSchema,
  getUserListsResponse: getUserListsResponseSchema,
  getIdeasOrderRequest: getIdeasOrderRequestSchema,
  getIdeasOrderResponse: getIdeasOrderResponseSchema,
};
