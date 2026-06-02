import { listsQuery } from '@/api/query/lists';
import z from 'zod';
import listsKeys from '@/hooks/api/lists/keys';
import { getListSchema } from '@/hooks/api/lists/useGetList';

const getListInfiniteIdeasSchema = getListSchema.omit({ offset: true }).extend({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
});

type UseGetListInfiniteIdeasOptions = z.input<
  typeof getListInfiniteIdeasSchema
>;

export const useGetListInfiniteIdeas = (
  options: UseGetListInfiniteIdeasOptions
) => {
  const { listID, limit, staleTime, gcTime, enabled } =
    getListInfiniteIdeasSchema.parse(options);

  return listsQuery.get.useInfiniteQuery(
    listsKeys.infiniteIdeas(listID),
    ({ pageParam = 0 }) => ({
      params: { listID },
      query: { offset: pageParam as number, limit },
    }),
    {
      queryKey: listsKeys.infiniteIdeas(listID),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const body = lastPage.body;
        const ideas = body.content.ideas;
        const currentOffset = body.offset ?? 0;
        const totalElements = body.totalElements ?? 0;

        if (ideas.length === 0) return undefined;

        const nextOffset = currentOffset + ideas.length;
        if (nextOffset >= totalElements) return undefined;

        return nextOffset;
      },
      select: (data) => ({
        pages: data.pages.map((page) => {
          const list = page.body.content;
          return {
            listInfo: list,
            ideas: list.ideas,
            nextOffset: (page.body.offset ?? 0) + list.ideas.length,
            total: page.body.totalElements ?? 0,
          };
        }),
      }),
      staleTime,
      gcTime,
      enabled: enabled && !!listID,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
};
