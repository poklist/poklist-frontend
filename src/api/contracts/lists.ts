import { listsSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const getListsContract = {
  method: 'GET',
  path: '/lists/:listID',
  pathParams: listsSchema.getRequest.pick({ listID: true }),
  query: listsSchema.getRequest.omit({ listID: true }),
  responses: { 200: listsSchema.getResponse },
  summary: 'info of LIST',
} satisfies AppRoute;

const getUserListsContract = {
  method: 'GET',
  path: '/:userCode/lists',
  pathParams: listsSchema.getUserListsRequest.pick({ userCode: true }),
  query: listsSchema.getUserListsRequest.omit({ userCode: true }),
  responses: { 200: listsSchema.getUserListsResponse },
  summary: 'all LISTS under specific user',
} satisfies AppRoute;

const getIdeasOrderContract = {
  method: 'GET',
  path: '/lists/:listID/order',
  pathParams: listsSchema.getIdeasOrderRequest,
  responses: { 200: listsSchema.getIdeasOrderResponse },
  summary: 'all ideas ORDER in specific list',
} satisfies AppRoute;

export const listsContract = {
  getListsContract,
  getUserListsContract,
  getIdeasOrderContract,
} satisfies Record<string, AppRoute>;
