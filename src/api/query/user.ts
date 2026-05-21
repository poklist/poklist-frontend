import { userContract } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { userSchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const userApi = initContract().router({
  getInfo: userContract.getInfoContract,
});

export type GetUserInfoRequest = z.input<typeof userSchema.getInfoRequest>;

export type GetUserInfoResponse = z.infer<typeof userSchema.getInfoResponse>;

export const userQuery = initQueryClient(userApi, {
  baseUrl: '',
  api: axiosFetcher<GetUserInfoResponse>,
});
