import { followingsSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

export const getFollowingsContract = {
  method: 'GET',
  path: '/following',
  query: followingsSchema.getRequest,
  responses: { 200: followingsSchema.getResponse },
  summary: 'all followings of specific user',
} satisfies AppRoute;

export const followingsContract = { getFollowingsContract } satisfies Record<
  string,
  AppRoute
>;
