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

const getCreatorListContract = {
  method: 'GET',
  path: '/creator/lists/:listID',
  pathParams: creatorListsSchema.listParams,
  responses: { 200: creatorListsSchema.getResponse },
  summary: 'edit settings of LIST, including lock and editToken (new API)',
} satisfies AppRoute;

const patchCreatorListContract = {
  method: 'PATCH',
  path: '/creator/lists/:listID',
  pathParams: creatorListsSchema.listParams,
  headers: creatorListsSchema.idempotencyHeaders,
  body: creatorListsSchema.patchRequest,
  responses: { 200: creatorListsSchema.patchResponse },
  summary: 'edit LIST with lock settings (new API)',
} satisfies AppRoute;

const postIncreaseCapacityContract = {
  method: 'POST',
  path: '/creator/lists/:listID/passwords/:passwordID/increase-capacity',
  pathParams: creatorListsSchema.increaseCapacityParams,
  headers: creatorListsSchema.idempotencyHeaders,
  body: creatorListsSchema.increaseCapacityRequest,
  responses: { 200: creatorListsSchema.increaseCapacityResponse },
  summary: 'increase password capacity of LIST by 10 (new API)',
} satisfies AppRoute;

export const creatorListsContract = {
  postCreatorListsContract,
  getCreatorListContract,
  patchCreatorListContract,
  postIncreaseCapacityContract,
} satisfies Record<string, AppRoute>;
