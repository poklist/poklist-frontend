import { discoverySchema } from '@/api/schemas';
import { AppRoute } from '@ts-rest/core';

export const getLatestListGroupsContract = {
  method: 'GET',
  path: `/discovery/latest-list-groups`,
  responses: { 200: discoverySchema.latestListGroups.getResponse },
  summary: 'all LIST of categories display in discovery page',
} satisfies AppRoute;

export const getOfficialCollectionsContract = {
  method: 'GET',
  path: `/discovery/official-collections`,
  responses: {
    200: discoverySchema.officialCollections.getResponse,
  },
  summary: 'official LIST display in discovery page',
} satisfies AppRoute;

export const discoveryContract = {
  getLatestListGroupsContract,
  getOfficialCollectionsContract,
} satisfies Record<string, AppRoute>;
