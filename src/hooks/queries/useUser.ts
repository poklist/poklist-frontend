import QueryKeys from '@/config/queryKeys';
import axios from '@/lib/axios';
import { IResponse } from '@/types/response';
import { User } from '@/types/User';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

interface UseUserOptions {
  userCode?: string;
  staleTime?: number;
  gcTime?: number;
  onError?: (error: Error) => void;
}

export const useUser = ({
  userCode,
  staleTime = 1000 * 60, // 1 minute
  gcTime = 1000 * 60 * 5, // 5 minutes
  onError,
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

  useEffect(() => {
    if (query.error) {
      onError?.(query.error);
    }
  }, [query.error, onError]);

  return {
    ...query,
    user: query.data,
  };
};
