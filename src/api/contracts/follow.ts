import { followSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const postFollowContract = {
  method: 'POST',
  path: '/follow',
  query: followSchema.postFollowRequest,
  body: followSchema.postFollowRequest.omit({ userID: true }),
  responses: { 200: followSchema.postFollowResponse },
} satisfies AppRoute;

export const followContract = {
  postFollowContract,
} satisfies Record<string, AppRoute>;
