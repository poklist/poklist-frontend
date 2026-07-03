import { unlikeSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const postUnlikeContract = {
  method: 'POST',
  path: '/unlike',
  query: unlikeSchema.postUnlikeRequest,
  body: unlikeSchema.postUnlikeRequest,
  responses: { 200: unlikeSchema.postUnlikeResponse },
  summary: 'unlike specific LIST',
} satisfies AppRoute;

export const unlikeContract = {
  postUnlikeContract,
} satisfies Record<string, AppRoute>;
