import ApiPath from '@/config/apiPath';
import QueryKeys from '@/config/queryKeys';
import { Idea } from '@/constants/list';
import axios from '@/lib/axios';
import { List } from '@/types/List';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

interface UseListOptions {
  listID?: string;
  offset?: number;
  limit?: number;
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export const useList = ({
  listID,
  offset = Idea.DEFAULT_FIRST_BATCH_OFFSET,
  limit = Idea.DEFAULT_BATCH_SIZE,
  staleTime = 1000 * 60, // 1 minute
  gcTime = 1000 * 60 * 5, // 5 minutes
  enabled = true,
  onError,
}: UseListOptions) => {
  const query = useQuery({
    queryKey: [QueryKeys.LIST, listID, offset, limit],
    queryFn: async () => {
      if (!listID) {
        console.error('listID is required');
      }
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
    enabled: enabled && !!listID,
    refetchOnMount: false, // 不要在被掛載時重新請求
    refetchOnWindowFocus: false, // 不要在視窗獲得焦點時重新請求
    refetchOnReconnect: false, // 不要在重新連線時重新請求
    initialData: undefined,
    refetchInterval: false,
  });

  useEffect(() => {
    if (query.error) {
      onError?.(query.error);
    }
  }, [query.error]);

  return {
    ...query,
  };
};
