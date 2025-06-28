import ApiPath from '@/constants/apiPath';
import QueryKeys from '@/constants/queryKeys';
import axios from '@/lib/axios';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';

interface UseOrderIdeasOptions {
  listID?: string;
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
}
export const useOrderIdeas = ({
  listID,
  staleTime = 60000, // 1 min
  gcTime = 300000, // 5 mins
  enabled = true,
}: UseOrderIdeasOptions) => {
  return useQuery({
    queryKey: [QueryKeys.ORDER_IDEAS, listID],
    queryFn: async () => {
      if (!listID) throw new Error('listID is required');
      const response = await axios.get<IResponse<number[]>>(
        `${ApiPath.lists}/${listID}/order`
      );
      return response.data.content ?? [];
    },
    staleTime,
    gcTime,
    enabled: enabled && !!listID,
  });
};
