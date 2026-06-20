import { usersSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const getInfoContract = {
  method: 'GET',
  path: '/:userCode/info',
  pathParams: usersSchema.getInfoRequest,
  responses: { 200: usersSchema.getInfoResponse },
  summary: 'info of USER',
} satisfies AppRoute;

const putUsersContracts = {
  method: 'PUT',
  path: '/users/me',
  body: usersSchema.putRequest,
  responses: { 200: usersSchema.putResponse },
  summary: 'edit USER',
} satisfies AppRoute;

export const usersContract = {
  getInfoContract,
  putUsersContracts,
} satisfies Record<string, AppRoute>;
