import { likeSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const postLikeContract = {
  method: 'POST',
  path: '/like',
  query: likeSchema.postLikeRequest,
  body: likeSchema.postLikeRequest,
  responses: { 200: likeSchema.postLikeResponse },
  summary: 'like specifier LIST',
} satisfies AppRoute;

export const likeContract = {
  postLikeContract,
} satisfies Record<string, AppRoute>;
