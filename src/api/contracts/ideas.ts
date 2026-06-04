import { ideasSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';
import z from 'zod';

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

const deleteIdeasContract = {
  method: 'DELETE',
  path: '/ideas/:ideaID',
  pathParams: ideasSchema.deleteRequest,
  body: z.object({}),
  responses: { 200: ideasSchema.deleteResponse },
  summary: 'delete IDEA',
} satisfies AppRoute;

export const ideasContract = {
  getIdeasContract,
  postIdeasContract,
  deleteIdeasContract,
} satisfies Record<string, AppRoute>;
