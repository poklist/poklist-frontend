import { categoriesQuery } from '@/api/query/categories';
import categoriesKeys from '@/hooks/api/categories/keys';

export const useGetCategories = () => {
  const query = categoriesQuery.get.useQuery(
    categoriesKeys.list(),
    {},
    {
      queryKey: categoriesKeys.list(),
      staleTime: Infinity,
      gcTime: 600000, // 10 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return {
    ...query,
    data: query.data?.body.content,
  };
};
