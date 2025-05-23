import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import { Category } from '@/types/List';
import { QUERY_KEYS } from '@/types/query';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';

export const useCategories = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const response = await axios.get<IResponse<Category[]>>(
        ApiPath.categories
      );
      return response.data.content;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
    categories: query.data ?? [],
    categoriesLoading: query.isLoading,
  };
};
