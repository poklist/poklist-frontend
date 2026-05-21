import { AppRoute } from '@ts-rest/core';
import { userSchema } from '@/api/schemas';

const getInfoContract = {
  method: 'GET',
  path: '/:userCode/info',
  pathParams: userSchema.getInfoRequest,
  responses: { 200: userSchema.getInfoResponse },
} satisfies AppRoute;

export const userContract = {
  getInfoContract,
} satisfies Record<string, AppRoute>;
