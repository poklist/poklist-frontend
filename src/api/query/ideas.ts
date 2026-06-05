import { ideasContract } from '@/api/contracts/ideas';
import { axiosFetcher } from '@/api/fetcher';
import { ideasSchema } from '@/api/schemas/ideas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const ideasApi = initContract().router({
  get: ideasContract.getIdeasContract,
  post: ideasContract.postIdeasContract,
  delete: ideasContract.deleteIdeasContract,
  put: ideasContract.putIdeasContract,
});

export type GetIdeasRequest = z.input<typeof ideasSchema.getRequest>;
export type GetIdeasResponse = z.infer<typeof ideasSchema.getResponse>;

export type PostIdeasRequest = z.input<typeof ideasSchema.postRequest>;

export type PostIdeasResponse = z.infer<typeof ideasSchema.postResponse>;

export type DeleteIdeasRequest = z.input<typeof ideasSchema.deleteRequest>;

export type PutIdeasRequest = z.input<typeof ideasSchema.putRequest>;

export type PutIdeasResponse = z.infer<typeof ideasSchema.putResponse>;

export const ideasQuery = initQueryClient(ideasApi, {
  baseUrl: '',
  api: axiosFetcher,
});
