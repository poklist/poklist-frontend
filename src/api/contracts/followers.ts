import { followersSchema } from '@/api/schemas/followers';
import { AppRoute } from '@ts-rest/core';

const getFollowersContract = {
  method: 'GET',
  path: '/followers',
  query: followersSchema.getRequest,
  responses: { 200: followersSchema.getResponse },
  summary: 'all FOLLOWERS of specific user',
} satisfies AppRoute;

export const followersContract = { getFollowersContract } satisfies Record<
  string,
  AppRoute
>;
