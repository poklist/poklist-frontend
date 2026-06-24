import { publishSchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

const getListsLimitsContract = {
  method: 'GET',
  path: '/publish/limits/lists',
  responses: { 200: publishSchema.getListsLimitsResponse },
  summary: 'get LIST publish limit',
} satisfies AppRoute;

const getIdeasLimitsContract = {
  method: 'GET',
  path: '/publish/limits/ideas',
  query: publishSchema.getIdeasLimitsRequest,
  responses: { 200: publishSchema.getIdeasLimitsResponse },
  summary: 'get IDEA publish limit',
} satisfies AppRoute;

export const publishContracts = {
  getListsLimitsContract,
  getIdeasLimitsContract,
} satisfies Record<string, AppRoute>;
