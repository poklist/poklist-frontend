import { ideasSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const getIdeasContract = {
  method: 'GET',
  path: '/ideas/:ideaID',
  pathParams: ideasSchema.getRequest,
  responses: { 200: ideasSchema.getResponse },
  summary: 'info of idea',
} satisfies AppRoute;

export const ideasContract = { getIdeasContract } satisfies Record<
  string,
  AppRoute
>;
