import { discoveryQuery } from '@/api/query/discovery';
import z from 'zod';
import discoveryKeys from './keys';

const getLatestListGroupsSchema = z.object({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
  enabled: z.boolean().default(true),
});

type UseGetLatestListGroupsOptions = z.input<typeof getLatestListGroupsSchema>;

export const useGetLatestListGroups = (
  options: UseGetLatestListGroupsOptions
) => {
  const { staleTime, gcTime, enabled } =
    getLatestListGroupsSchema.parse(options);

  const query = discoveryQuery.getLatestListGroups.useQuery(
    discoveryKeys.latestListGroups(),
    {},
    {
      queryKey: discoveryKeys.latestListGroups(),
      staleTime,
      gcTime,
      enabled,
      refetchOnWindowFocus: 'always',
      refetchOnReconnect: 'always',
    }
  );

  return {
    ...query,
    data: query.data?.body.content,
  };
};
