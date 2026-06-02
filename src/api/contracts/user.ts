import { userSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const getInfoContract = {
  method: 'GET',
  path: '/:userCode/info',
  pathParams: userSchema.getInfoRequest,
  responses: { 200: userSchema.getInfoResponse },
  summary: 'info of USER',
} satisfies AppRoute;

export const userContract = {
  getInfoContract,
} satisfies Record<string, AppRoute>;
