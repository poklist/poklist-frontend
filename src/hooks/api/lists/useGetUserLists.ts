import { listsQuery } from '@/api/query/lists';
import { listsSchema } from '@/api/schemas';
import { List } from '@/constants/list';
import z from 'zod';
import listsKeys from '@/hooks/api/lists/keys';

const getUserListsSchema = listsSchema.getUserListsRequest.extend({
  offset: z
    .number()
    .int()
    .nonnegative()
    .default(List.DEFAULT_FIRST_BATCH_OFFSET),
  limit: z.number().int().nonnegative().default(List.DEFAULT_FIRST_BATCH_SIZE),
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
});

type GetUserListsOptions = z.input<typeof getUserListsSchema>;

export const useGetUserLists = (options: GetUserListsOptions) => {
  const { userCode, offset, limit, staleTime, gcTime } =
    getUserListsSchema.parse(options);

  const query = listsQuery.getUserLists.useQuery(
    listsKeys.userLists(userCode),
    { params: { userCode }, query: { offset, limit } },
    {
      queryKey: listsKeys.userLists(userCode),
      staleTime,
      gcTime,
      enabled: !!userCode,
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
