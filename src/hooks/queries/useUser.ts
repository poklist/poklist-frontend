import axios from '@/lib/axios';
import { User } from '@/types/User';
import QueryKeys from '@/config/queryKeys';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';

interface UseUserOptions {
  userCode?: string;
  staleTime?: number;
  gcTime?: number;
}

export const useUser = ({
  userCode,
  staleTime = 1000 * 60, // 1 minute
  gcTime = 1000 * 60 * 5, // 5 minutes
}: UseUserOptions) => {
  const query = useQuery({
    queryKey: [QueryKeys.USER, userCode],
    queryFn: async () => {
      if (!userCode) {
        throw new Error('userCode is required');
      }
      const response = await axios.get<IResponse<User>>(`/${userCode}/info`);
      if (!response.data.content) {
        throw new Error('No content');
      }
      return response.data.content;
    },
    staleTime,
    gcTime,
    enabled: !!userCode,
  });

  return {
    ...query,
    user: query.data,
  };
};
