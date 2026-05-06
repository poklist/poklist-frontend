import { ideaContract } from '@/api/contracts/idea';
import { axiosFetcher } from '@/api/fetcher';
import { ideaSchema } from '@/api/schemas/idea';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const ideaApi = initContract().router({ get: ideaContract.getIdeaContract });

export type GetIdeaRequest = z.input<typeof ideaSchema.getRequest>;
export type GetIdeaResponse = z.infer<typeof ideaSchema.getResponse>;

export const ideaQuery = initQueryClient(ideaApi, {
  baseUrl: '',
  api: axiosFetcher<GetIdeaResponse>,
});
