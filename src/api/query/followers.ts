import { followersContract } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { followersSchema } from '@/api/schemas/followers';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const followersApi = initContract().router({
  get: followersContract.getFollowersContract,
});

export type GetFollowersRequest = z.infer<typeof followersSchema.getRequest>;
export type GetFollowersResponse = z.infer<typeof followersSchema.getResponse>;

export const followersQuery = initQueryClient(followersApi, {
  baseUrl: '',
  api: axiosFetcher<GetFollowersResponse>,
});
