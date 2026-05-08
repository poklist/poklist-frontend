import { categoriesContract } from '@/api/contracts/categories';
import { axiosFetcher } from '@/api/fetcher';
import { categoriesSchema } from '@/api/schemas/categories';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import { z } from 'zod';

const categoriesApi = initContract().router({
  get: categoriesContract.getCategoriesContract,
});

type GetCategoryResponse = z.infer<typeof categoriesSchema.getResponse>;

export const categoriesQuery = initQueryClient(categoriesApi, {
  baseUrl: '',
  api: axiosFetcher<GetCategoryResponse>,
});
