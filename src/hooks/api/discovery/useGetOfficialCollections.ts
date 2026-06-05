import { discoveryQuery } from '@/api/query/discovery';
import z from 'zod';
import discoveryKeys from '@/hooks/api/discovery/keys';

const getOfficialCollectionsSchema = z.object({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
});

type UseGetOfficialCollectionsOptions = z.input<
  typeof getOfficialCollectionsSchema
>;

export const useGetOfficialCollections = (
  options: UseGetOfficialCollectionsOptions
) => {
  const { staleTime, gcTime } = getOfficialCollectionsSchema.parse(options);

  const query = discoveryQuery.getOfficialCollections.useQuery(
    discoveryKeys.officialCollections(),
    {},
    {
      queryKey: discoveryKeys.officialCollections(),
      staleTime,
      gcTime,
      refetchOnWindowFocus: 'always',
      refetchOnReconnect: 'always',
    }
  );

  return {
    ...query,
    data: query.data?.body.content,
  };
};
