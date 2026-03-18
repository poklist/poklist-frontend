import { categoriesSchema } from '@/api/schemas/categories';
import { AppRoute } from '@ts-rest/core';

export const getCategoriesResponse = {
  method: 'GET',
  path: '/categories',
  responses: {
    200: categoriesSchema.getResponse,
  },
  summary: 'all categories of LIST',
} satisfies AppRoute;

export const categoriesContract = { getCategoriesResponse } satisfies Record<
  string,
  AppRoute
>;
