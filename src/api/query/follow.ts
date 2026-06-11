import { followContract } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { followSchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const followApi = initContract().router({
  postFollow: followContract.postFollowContract,
});

export type PostFollowRequest = z.input<typeof followSchema.postFollowRequest>;

export type PostFollowResponse = z.infer<
  typeof followSchema.postFollowResponse
>;

export const followQuery = initQueryClient(followApi, {
  baseUrl: '',
  api: axiosFetcher,
});
