import axios from '@/lib/axios';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';
import { LatestListGroup } from '@/types/Discovery';

interface UseLatestListGroupsOptions {
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
}

export const useLatestListGroups = ({
  staleTime = 1000 * 60, // 1 minute
  gcTime = 1000 * 60 * 5, // 5 minutes
  enabled = true,
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
    enabled,
  });

  return {
    ...query,
    latestListGroups: query.data ?? {},
  };
};
