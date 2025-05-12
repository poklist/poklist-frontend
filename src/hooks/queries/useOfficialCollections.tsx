import axios from '@/lib/axios';
import { OfficialCollection } from '@/types/Discovery';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';

interface UseOfficialCollectionsOptions {
  staleTime?: number;
  gcTime?: number;
}

export const useOfficialCollections = ({
  staleTime = 1000 * 60 * 30, // 30 minutes
  gcTime = 1000 * 60 * 120, // 2 hours
}: UseOfficialCollectionsOptions) => {
  const query = useQuery({
    queryKey: ['officialCollections'],
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
