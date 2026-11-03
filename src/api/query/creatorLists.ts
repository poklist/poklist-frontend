import { creatorListsContract } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { creatorListsSchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const creatorListsApi = initContract().router({
  post: creatorListsContract.postCreatorListsContract,
});

export type PostCreatorListsRequest = z.input<
  typeof creatorListsSchema.postRequest
>;

export type PostCreatorListsResponse = z.infer<
  typeof creatorListsSchema.postResponse
>;

export const creatorListsQuery = initQueryClient(creatorListsApi, {
  baseUrl: '',
  api: axiosFetcher,
});
