import { ideasQuery } from '@/api/query/ideas';
import { ideasSchema } from '@/api/schemas';
import { Idea } from '@/constants/list';
import z from 'zod';
import ideasKeys from './keys';

const getInfiniteIdeasUnderListSchema = ideasSchema.getIdeasUnderListRequest
  .omit({ offset: true })
  .extend({
    limit: z
      .number()
      .int()
      .nonnegative()
      .default(Idea.DEFAULT_FIRST_BATCH_SIZE),
    staleTime: z.number().int().nonnegative().default(60000),
    gcTime: z.number().int().nonnegative().default(300000),
    enabled: z.boolean().default(true),
  });

type UseGetInfiniteIdeasUnderListOptions = z.input<
  typeof getInfiniteIdeasUnderListSchema
>;

export const useGetInfiniteIdeasUnderList = (
  options: UseGetInfiniteIdeasUnderListOptions
) => {
  const { listID, limit, staleTime, gcTime, enabled } =
    getInfiniteIdeasUnderListSchema.parse(options);

  return ideasQuery.getIdeasUnderList.useInfiniteQuery(
    ideasKeys.infiniteIdeasUnderList(listID),
    ({ pageParam = 0 }) => ({
      query: { listID, offset: pageParam as number, limit },
    }),
    {
      queryKey: ideasKeys.infiniteIdeasUnderList(listID),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const { ideas, ideaTotalCount } = lastPage.body;

        if (ideas.length === 0) return undefined;

        const totalFetched = allPages.reduce(
          (sum, page) => sum + page.body.ideas.length,
          0
        );
        if (totalFetched >= ideaTotalCount) return undefined;

        return totalFetched;
      },
      select: (data) => ({
        pages: data.pages.map((page, index) => {
          const body = page.body;
          const prevTotal = data.pages
            .slice(0, index)
            .reduce((sum, p) => sum + p.body.ideas.length, 0);
          return {
            ideas: body.ideas,
            nextOffset: prevTotal + body.ideas.length,
            total: body.ideaTotalCount ?? 0,
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
