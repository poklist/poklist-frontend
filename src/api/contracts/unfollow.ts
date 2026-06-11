import { unfollowSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const postUnfollowContract = {
  method: 'POST',
  path: '/unfollow',
  query: unfollowSchema.postUnfollowRequest,
  body: unfollowSchema.postUnfollowRequest.omit({ userID: true }),
  responses: { 200: unfollowSchema.postUnfollowResponse },
} satisfies AppRoute;

export const unfollowContract = {
  postUnfollowContract,
} satisfies Record<string, AppRoute>;
