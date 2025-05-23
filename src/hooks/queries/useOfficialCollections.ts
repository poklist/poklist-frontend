import axios from '@/lib/axios';
import { OfficialCollection } from '@/types/Discovery';
import { QUERY_KEYS } from '@/types/query';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';

interface UseOfficialCollectionsOptions {
  staleTime?: number;
  gcTime?: number;
}

export const useOfficialCollections = ({
  staleTime = 1000 * 60, // 1 minute
  gcTime = 1000 * 60 * 5, // 5 minutes
}: UseOfficialCollectionsOptions) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.OFFICIAL_COLLECTIONS],
    queryFn: async () => {
      const response = await axios.get<IResponse<OfficialCollection[]>>(
        `/discovery/official-collections`
      );
      return response.data.content ?? [];
    },
    staleTime,
    gcTime,
    enabled: true,
  });

  return {
    ...query,
    officialCollections: query.data ?? [],
  };
};
