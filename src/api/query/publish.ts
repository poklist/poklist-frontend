import { publishContracts } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { publishSchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const publishApi = initContract().router({
  getListsLimits: publishContracts.getListsLimitsContract,
  getIdeasLimits: publishContracts.getIdeasLimitsContract,
});

export type GetPublishListsLimitsResponse = z.infer<
  typeof publishSchema.getListsLimitsResponse
>;

export type GetPublishIdeasLimitsRequest = z.input<
  typeof publishSchema.getIdeasLimitsRequest
>;

export type GetPublishIdeasLimitsResponse = z.infer<
  typeof publishSchema.getIdeasLimitsResponse
>;

export const publishQuery = initQueryClient(publishApi, {
  baseUrl: '',
  api: axiosFetcher,
});
