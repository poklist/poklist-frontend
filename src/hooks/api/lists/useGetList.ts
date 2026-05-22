import { listsQuery } from '@/api/query/lists';
import { listsSchema } from '@/api/schemas';
import { List } from '@/constants/list';
import z from 'zod';
import listsKeys from './keys';

export const getListSchema = listsSchema.getRequest.extend({
  offset: z
    .number()
    .int()
    .nonnegative()
    .default(List.DEFAULT_FIRST_BATCH_OFFSET),
  limit: z.number().int().nonnegative().default(List.DEFAULT_FIRST_BATCH_SIZE),
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
  enabled: z.boolean().default(true),
  // onError: z.custom<((error: Error) => void)>((value) => typeof value === 'function').optional()
});

type UseGetListOptions = z.input<typeof getListSchema>;

export const useGetList = (options: UseGetListOptions) => {
  const { listID, offset, limit, staleTime, gcTime, enabled } =
    getListSchema.parse(options);

  const query = listsQuery.get.useQuery(
    listsKeys.list(listID),
    { params: { listID }, query: { offset, limit } },
    {
      queryKey: listsKeys.list(listID),
      staleTime,
      gcTime,
      enabled: enabled && !!listID,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: undefined,
      refetchInterval: false,
    }
  );

  return {
    ...query,
    data: query.data?.body.content,
  };
};
