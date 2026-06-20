import { unfollowContract } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { unfollowSchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const unfollowApi = initContract().router({
  postUnfollow: unfollowContract.postUnfollowContract,
});

export type PostUnfollowRequest = z.input<
  typeof unfollowSchema.postUnfollowRequest
>;

export type PostUnfollowResponse = z.infer<
  typeof unfollowSchema.postUnfollowResponse
>;

export const unfollowQuery = initQueryClient(unfollowApi, {
  baseUrl: '',
  api: axiosFetcher,
});
