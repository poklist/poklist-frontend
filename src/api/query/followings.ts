import { followingsContract } from '@/api/contracts/followings';
import { axiosFetcher } from '@/api/fetcher';
import { followingsSchema } from '@/api/schemas/followings';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const followingsApi = initContract().router({
  get: followingsContract.getFollowingsContract,
});

export type GetFollowingsRequest = z.input<typeof followingsSchema.getRequest>;
export type GetFollowingsResponse = z.infer<
  typeof followingsSchema.getResponse
>;

export const followingsQuery = initQueryClient(followingsApi, {
  baseUrl: '',
  api: axiosFetcher<GetFollowingsResponse>,
});
