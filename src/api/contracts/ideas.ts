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

const putIdeasContract = {
  method: 'PUT',
  path: '/ideas/:id',
  pathParams: ideasSchema.putRequest.pick({ id: true }),
  body: ideasSchema.putRequest.omit({ id: true }),
  responses: { 200: ideasSchema.putResponse },
  summary: 'edit IDEA',
} satisfies AppRoute;

const getIdeasUnderListContract = {
  method: 'GET',
  path: '/ideas',
  query: ideasSchema.getIdeasUnderListRequest,
  responses: { 200: ideasSchema.getIdeasUnderListResponse },
  summary: 'IDEA under list',
} satisfies AppRoute;

export const ideasContract = {
  getIdeasContract,
  postIdeasContract,
  deleteIdeasContract,
  putIdeasContract,
  getIdeasUnderListContract,
} satisfies Record<string, AppRoute>;
