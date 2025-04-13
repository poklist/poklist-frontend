import ApiPath from '@/config/apiPath';
import { DEFAULT_IDEA_BATCH_SIZE_MAX } from '@/constants/list';
import axios from '@/lib/axios';
import { List } from '@/types/List';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';

interface UseListOptions {
  listID?: string;
  offset?: number;
  limit?: number;
  staleTime?: number;
  gcTime?: number;
}

export const useList = ({
  listID,
  offset = 0,
  limit = DEFAULT_IDEA_BATCH_SIZE_MAX,
  staleTime = 1000 * 60, // 1 minute
  gcTime = 1000 * 60 * 5, // 5 minutes
}: UseListOptions) => {
  console.log('useList called with listID:', listID); // Debug log

  const query = useQuery({
    queryKey: ['list', listID, offset, limit],
    queryFn: async () => {
      if (!listID) {
        throw new Error('listID is required');
      }
      console.log('Fetching list data...', {
        listID,
        time: new Date().toISOString(),
      }); // Debug log
      const response = await axios.get<IResponse<List>>(
        `${ApiPath.lists}/${listID}`,
        {
          params: {
            offset,
            limit,
          },
        }
      );
      return response.data.content;
    },
    staleTime,
    gcTime,
    enabled: !!listID,
    refetchOnMount: false, // 不要在被掛載時重新請求
    refetchOnWindowFocus: false, // 不要在視窗獲得焦點時重新請求
    refetchOnReconnect: false, // 不要在重新連線時重新請求
    initialData: undefined,
    refetchInterval: false,
  });

  // Debug log for query status changes
  console.log('Query status:', {
    status: query.status,
    isFetching: query.isFetching,
    dataUpdatedAt: query.dataUpdatedAt,
    time: new Date().toISOString(),
  });

  return {
    ...query,
  };
};
