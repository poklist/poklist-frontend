import { ideasContract } from '@/api/contracts/ideas';
import { axiosFetcher } from '@/api/fetcher';
import { ideasSchema } from '@/api/schemas/ideas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const ideasApi = initContract().router({ get: ideasContract.getIdeasContract });

export type GetIdeasRequest = z.input<typeof ideasSchema.getRequest>;
export type GetIdeasResponse = z.infer<typeof ideasSchema.getResponse>;

export const ideasQuery = initQueryClient(ideasApi, {
  baseUrl: '',
  api: axiosFetcher<GetIdeasResponse>,
});
