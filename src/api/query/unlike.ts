import { unlikeContract } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { unlikeSchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const unlikeApi = initContract().router({
  postUnlike: unlikeContract.postUnlikeContract,
});

export type PostUnlikeRequest = z.input<typeof unlikeSchema.postUnlikeRequest>;
export type PostUnlikeResponse = z.infer<
  typeof unlikeSchema.postUnlikeResponse
>;

export const unlikeQuery = initQueryClient(unlikeApi, {
  baseUrl: '',
  api: axiosFetcher,
});
