import { creatorListsSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const postCreatorListsContract = {
  method: 'POST',
  path: '/creator/lists',
  headers: creatorListsSchema.idempotencyHeaders,
  body: creatorListsSchema.postRequest,
  responses: { 200: creatorListsSchema.postResponse },
  summary: 'create LIST with lock settings (new API)',
} satisfies AppRoute;

export const creatorListsContract = {
  postCreatorListsContract,
} satisfies Record<string, AppRoute>;
