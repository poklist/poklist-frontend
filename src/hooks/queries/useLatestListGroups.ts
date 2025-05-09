import axios from '@/lib/axios';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';
import { LatestListGroup } from '@/types/Discovery';

interface UseLatestListGroupsOptions {
  staleTime?: number;
  gcTime?: number;
}

export const useLatestListGroups = ({
  staleTime = 1000 * 60, // 1 minute
  gcTime = 1000 * 60 * 5, // 5 minutes
}: UseLatestListGroupsOptions) => {
  const query = useQuery({
    queryKey: ['latestListGroups'],
    queryFn: async () => {
      const response = await axios.get<IResponse<LatestListGroup>>(
        `/discovery/latest-list-groups`
      );
      return response.data.content ?? {};
    },
    staleTime,
    gcTime,
    enabled: true,
  });

  return {
    ...query,
    latestListGroups: query.data ?? {},
  };
};
