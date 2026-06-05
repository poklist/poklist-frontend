import { listsSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';
import z from 'zod';

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

const postListsContract = {
  method: 'POST',
  path: '/lists',
  body: listsSchema.postRequest,
  responses: { 200: listsSchema.postResponse },
  summary: 'create LIST',
} satisfies AppRoute;

const deleteListsContract = {
  method: 'DELETE',
  path: '/lists/:listID',
  pathParams: listsSchema.deleteRequest,
  body: z.object({}),
  responses: { 200: listsSchema.deleteResponse },
  summary: 'delete LIST',
} satisfies AppRoute;

const putListsContract = {
  method: 'PUT',
  path: '/lists/:listID',
  pathParams: listsSchema.putRequest.pick({ listID: true }),
  body: listsSchema.putRequest.omit({ listID: true }),
  responses: { 200: listsSchema.putResponse },
  summary: 'edit LIST',
} satisfies AppRoute;

export const listsContract = {
  getListsContract,
  getUserListsContract,
  getIdeasOrderContract,
  postListsContract,
  deleteListsContract,
  putListsContract,
} satisfies Record<string, AppRoute>;
