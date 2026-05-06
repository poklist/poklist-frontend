import { ideaSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

export const getIdeaContract = {
  method: 'GET',
  path: '/ideas/:ideaID',
  pathParams: ideaSchema.getRequest,
  responses: { 200: ideaSchema.getResponse },
  summary: 'info of idea',
} satisfies AppRoute;

export const ideaContract = { getIdeaContract } satisfies Record<
  string,
  AppRoute
>;
