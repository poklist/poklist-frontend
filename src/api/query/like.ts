import { likeContract } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { likeSchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const likeApi = initContract().router({
  postLike: likeContract.postLikeContract,
});

export type PostLikeRequest = z.input<typeof likeSchema.postLikeRequest>;

export type PostLikeResponse = z.infer<typeof likeSchema.postLikeResponse>;

export const likeQuery = initQueryClient(likeApi, {
  baseUrl: '',
  api: axiosFetcher,
});
