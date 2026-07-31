import { listsQuery } from '@/api/query/lists';
import { listsSchema } from '@/api/schemas';
import { List } from '@/constants/list';
import listsKeys from '@/hooks/api/lists/keys';
import z from 'zod';

const getInfiniteListsUnderUserSchema = listsSchema.getUserListsRequest
  .omit({ offset: true })
  .extend({
    limit: z
      .number()
      .int()
      .nonnegative()
      .default(List.DEFAULT_FIRST_BATCH_SIZE),
    staleTime: z.number().int().nonnegative().default(60000),
    gcTime: z.number().int().nonnegative().default(300000),
    enabled: z.boolean().default(true),
  });

type UseGetInfiniteListsUnderUserOptions = z.input<
  typeof getInfiniteListsUnderUserSchema
>;

export const useGetInfiniteLists = (
  options: UseGetInfiniteListsUnderUserOptions
) => {
  const { userCode, limit, staleTime, gcTime, enabled } =
    getInfiniteListsUnderUserSchema.parse(options);

  return listsQuery.getUserLists.useInfiniteQuery(
    listsKeys.userInfiniteLists(userCode),
    ({ pageParam = 0 }) => ({
      params: { userCode },
      query: { offset: pageParam as number, limit },
    }),
    {
      queryKey: listsKeys.userInfiniteLists(userCode),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const body = lastPage.body;
        const lists = body.content;
        const currentOffset = body.offset ?? 0;
        const totalElements = body.totalElements ?? 0;

        if (lists.length === 0) return undefined;

        const nextOffset = currentOffset + lists.length;
        if (nextOffset >= totalElements) return undefined;

        return nextOffset;
      },
      select: (data) => ({
        pages: data.pages.map((page) => {
          const lists = page.body.content;
          return {
            lists,
            nextOffset: (page.body.offset ?? 0) + lists.length,
            total: page.body.totalElements ?? 0,
          };
        }),
      }),
      staleTime,
      gcTime,
      enabled: enabled && !!userCode,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
};
