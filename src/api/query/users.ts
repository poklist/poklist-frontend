import { usersContract } from '@/api/contracts';
import { axiosFetcher } from '@/api/fetcher';
import { usersSchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const userApi = initContract().router({
  getInfo: usersContract.getInfoContract,
  putSelf: usersContract.putUsersContracts,
});

export type GetUserInfoRequest = z.input<typeof usersSchema.getInfoRequest>;

export type GetUserInfoResponse = z.infer<typeof usersSchema.getInfoResponse>;

export type PutSelfRequest = z.input<typeof usersSchema.putRequest>;

export type PutSelfResponse = z.infer<typeof usersSchema.putResponse>;

export const usersQuery = initQueryClient(userApi, {
  baseUrl: '',
  api: axiosFetcher,
});
