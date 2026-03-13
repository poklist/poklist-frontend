import axios from '@/api/axios';
import ApiPath from '@/constants/apiPath';
import { List } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { ListPreview } from '@/types/List';
import { IResponse } from '@/types/response';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseListPreviewsOptions {
  userCode?: string;
  enabled?: boolean;
  offset?: number;
  limit?: number;
  staleTime?: number;
  gcTime?: number;
}

export const useInfiniteLists = ({
  userCode,
  offset = List.DEFAULT_FIRST_BATCH_OFFSET,
  limit = List.DEFAULT_BATCH_SIZE,
  enabled = true,
  staleTime = 60000, // 1 minute
  gcTime = 300000, // 5 minutes
}: UseListPreviewsOptions) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.LISTS, userCode, offset, limit],
    enabled: enabled && !!userCode,
    queryFn: async ({ pageParam = 0 }) => {
      if (!userCode) throw new Error('userCode is required');

      const response = await axios.get<IResponse<ListPreview[]>>(
        `/${userCode}${ApiPath.lists}`,
        { params: { offset: pageParam, limit } }
      );

      const list = response.data.content!;
      return {
        list,
        nextOffset: (response.data.offset ?? 0) + (list.length ?? 0),
        total: response.data.totalElements ?? 0,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.list.length === 0) return undefined;
      if (lastPage.nextOffset >= lastPage.total) return undefined;
      return lastPage.nextOffset;
    },
    staleTime,
    gcTime,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
