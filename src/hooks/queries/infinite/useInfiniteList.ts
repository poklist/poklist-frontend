import ApiPath from '@/config/apiPath';
import { Idea } from '@/constants/list';
import axios from '@/lib/axios';
import { List } from '@/types/List';
import { IResponse } from '@/types/response';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseInfiniteListOptions {
  listID?: string;
  limit?: number;
  enabled?: boolean;
}

export const useInfiniteList = ({
  listID,
  limit = Idea.DEFAULT_BATCH_SIZE,
  enabled = true,
}: UseInfiniteListOptions) => {
  return useInfiniteQuery({
    queryKey: ['infiniteList', listID],
    enabled: enabled && !!listID,
    queryFn: async ({ pageParam = 0 }) => {
      if (!listID) throw new Error('listID is required');

      const response = await axios.get<IResponse<List>>(
        `${ApiPath.lists}/${listID}`,
        {
          params: {
            offset: pageParam,
            limit,
          },
        }
      );

      const list = response.data.content!;
      return {
        listInfo: list,
        ideas: list.ideas ?? [],
        nextOffset: (response.data.offset ?? 0) + (list.ideas?.length ?? 0),
        total: response.data.totalElements ?? 0,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.ideas.length === 0) return undefined;
      if (lastPage.nextOffset >= lastPage.total) return undefined;
      return lastPage.nextOffset;
    },
    staleTime: 60000, // 1min
    gcTime: 300000, // 5mins
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
