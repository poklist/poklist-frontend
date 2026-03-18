import { getCategories } from "@/api/paths/categories/get"
import categoriesKeys from "./key"

export const useGetCategories = () => {
  const query = getCategories.get.useQuery(
    categoriesKeys.list(),
    {},
    {
      queryKey: categoriesKeys.list(),
      staleTime: 300000, // 5 minutes
      gcTime: 600000, // 10 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  )

  return {
    ...query,
    categories: query.data?.body.content ?? [],
    categoriesLoading: query.isLoading
  }
}