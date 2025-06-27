import { List } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import axios from '@/lib/axios';
import { ListPreview } from '@/types/List';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';

interface UseListPreviewsOptions {
  userCode?: string;
  offset?: number;
  limit?: number;
  staleTime?: number;
  gcTime?: number;
}

export const useListPreviews = ({
  userCode,
  offset = List.DEFAULT_FIRST_BATCH_OFFSET,
  limit = List.DEFAULT_BATCH_SIZE,
  staleTime = 1000 * 60, // 1 minute
  gcTime = 1000 * 60 * 5, // 5 minutes
}: UseListPreviewsOptions) => {
  const query = useQuery({
    queryKey: [QueryKeys.LISTS, userCode, offset, limit],
    queryFn: async () => {
      if (!userCode) {
        throw new Error('userCode is required');
      }
      const response = await axios.get<IResponse<ListPreview[]>>(
        `/${userCode}/lists`,
        {
          params: {
            offset,
            limit,
          },
        }
      );
      return response.data.content ?? [];
    },
    staleTime,
    gcTime,
    enabled: !!userCode,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
    lists: query.data ?? [],
  };
};
