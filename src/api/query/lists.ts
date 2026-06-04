import { listsContract } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { listsSchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const listsApi = initContract().router({
  get: listsContract.getListsContract,
  getUserLists: listsContract.getUserListsContract,
  getIdeasOrder: listsContract.getIdeasOrderContract,
  post: listsContract.postListsContract,
});

export type GetListsRequest = z.input<typeof listsSchema.getRequest>;

export type GetListsResponse = z.infer<typeof listsSchema.getResponse>;

export type GetUserListsRequest = z.input<
  typeof listsSchema.getUserListsRequest
>;

export type GetUserListsResponse = z.infer<
  typeof listsSchema.getUserListsResponse
>;

export type GetIdeasOrderRequest = z.input<
  typeof listsSchema.getIdeasOrderRequest
>;

export type GetIdeasOrderResponse = z.infer<
  typeof listsSchema.getIdeasOrderResponse
>;

export type PostListsRequest = z.input<typeof listsSchema.postRequest>;

export type PostListsResponse = z.infer<typeof listsSchema.postResponse>;

export const listsQuery = initQueryClient(listsApi, {
  baseUrl: '',
  api: axiosFetcher<
    | GetListsResponse
    | GetUserListsResponse
    | GetIdeasOrderResponse
    | PostListsResponse
  >,
});
