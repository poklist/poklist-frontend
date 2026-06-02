import { ideasSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const getIdeasContract = {
  method: 'GET',
  path: '/ideas/:ideaID',
  pathParams: ideasSchema.getRequest,
  responses: { 200: ideasSchema.getResponse },
  summary: 'info of IDEA',
} satisfies AppRoute;

const postIdeasContract = {
  method: 'POST',
  path: '/ideas',
  body: ideasSchema.postRequest,
  responses: { 200: ideasSchema.postResponse },
  summary: 'create IDEA to specific list',
} satisfies AppRoute;

export const ideasContract = {
  getIdeasContract,
  postIdeasContract,
} satisfies Record<string, AppRoute>;
