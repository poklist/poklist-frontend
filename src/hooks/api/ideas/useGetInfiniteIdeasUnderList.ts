import { ideasQuery } from '@/api/query/ideas';
import { ideasSchema } from '@/api/schemas';
import { Idea } from '@/constants/list';
import z from 'zod';
import { computeNextOffset, sumFetched } from '@/hooks/api/ideas/offset';
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
        const totalFetched = sumFetched(
          allPages,
          (page) => page.body.ideas.length
        );
        return computeNextOffset(totalFetched, ideaTotalCount, ideas.length);
      },
      select: (data) => ({
        pages: data.pages.map((page, index) => ({
          ideas: page.body.ideas,
          nextOffset: sumFetched(
            data.pages.slice(0, index + 1),
            (p) => p.body.ideas.length
          ),
          total: page.body.ideaTotalCount ?? 0,
        })),
      }),
      staleTime,
      gcTime,
      enabled: enabled && !!listID,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
    }
  );
};
