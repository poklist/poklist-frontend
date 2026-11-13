import { creatorListsContract } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { creatorListsSchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const creatorListsApi = initContract().router({
  post: creatorListsContract.postCreatorListsContract,
  get: creatorListsContract.getCreatorListContract,
  patch: creatorListsContract.patchCreatorListContract,
  increaseCapacity: creatorListsContract.postIncreaseCapacityContract,
});

export type PostCreatorListsRequest = z.input<
  typeof creatorListsSchema.postRequest
>;

export type PostCreatorListsResponse = z.infer<
  typeof creatorListsSchema.postResponse
>;

export type GetCreatorListResponse = z.infer<
  typeof creatorListsSchema.getResponse
>;

export type PatchCreatorListRequest = z.input<
  typeof creatorListsSchema.patchRequest
>;

export type PatchCreatorListResponse = z.infer<
  typeof creatorListsSchema.patchResponse
>;

export type IncreaseCapacityResponse = z.infer<
  typeof creatorListsSchema.increaseCapacityResponse
>;

export const creatorListsQuery = initQueryClient(creatorListsApi, {
  baseUrl: '',
  api: axiosFetcher,
});
