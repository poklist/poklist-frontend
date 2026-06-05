import {
  createInfiniteResponseSchema,
  createResponseSchema,
  userBriefSchema,
} from '@/api/schemas/common';
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

const getResponseSchema = createInfiniteResponseSchema(
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

const postRequestSchema = ListFormSchema;

const postResponseSchema = createResponseSchema(
  ListFormSchema.omit({ coverImage: true }).extend({ id: z.string() })
);

const deleteRequestSchema = z.object({ listID: z.string() });

const deleteResponseSchema = createResponseSchema(z.unknown());

const putRequestSchema = ListFormSchema.extend({ listID: z.string() });

const putResponseSchema = createResponseSchema(
  listPreviewSchema.extend({
    likeCount: z.number().int().nonnegative(),
    isLiked: z.boolean(),
    createdAt: z.string().min(0).max(0),
    updatedAt: z.string().min(0).max(0),
    ideas: z.null(),
    ideaTotalCount: z.number().min(0).max(0),
    owner: userBriefSchema.extend({
      id: z.number().min(0).max(0),
      displayName: z.string().min(0).max(0),
      userCode: z.string().min(0).max(0),
      profileImage: z.string().min(0).max(0),
    }),
  })
);

export const listsSchema = {
  getRequest: getRequestSchema,
  getResponse: getResponseSchema,
  getUserListsRequest: getUserListsRequestSchema,
  getUserListsResponse: getUserListsResponseSchema,
  getIdeasOrderRequest: getIdeasOrderRequestSchema,
  getIdeasOrderResponse: getIdeasOrderResponseSchema,
  postRequest: postRequestSchema,
  postResponse: postResponseSchema,
  deleteRequest: deleteRequestSchema,
  deleteResponse: deleteResponseSchema,
  putRequest: putRequestSchema,
  putResponse: putResponseSchema,
};
