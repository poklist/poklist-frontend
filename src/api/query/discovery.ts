import { discoveryContract } from '@/api/contracts/discovery';
import { axiosFetcher } from '@/api/fetcher';
import { discoverySchema } from '@/api/schemas';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import z from 'zod';

const discoveryApi = initContract().router({
  getLatestListGroups: discoveryContract.getLatestListGroupsContract,
  getOfficialCollections: discoveryContract.getOfficialCollectionsContract,
});

export type GetLatestListGroupsResponse = z.infer<
  typeof discoverySchema.latestListGroups.getResponse
>;
export type GetOfficialCollectionsResponse = z.infer<
  typeof discoverySchema.officialCollections.getResponse
>;

export const discoveryQuery = initQueryClient(discoveryApi, {
  baseUrl: '',
  api: axiosFetcher<
    GetLatestListGroupsResponse | GetOfficialCollectionsResponse
  >,
});
