import { listsQuery } from '@/api/query/lists';
import { listsSchema } from '@/api/schemas';
import z from 'zod';
import listsKeys from './keys';

const getIdeasOrderSchema = listsSchema.getIdeasOrderRequest.extend({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
  enabled: z.boolean().default(true),
});

type GetIdeasOrderOptions = z.input<typeof getIdeasOrderSchema>;

export const useGetIdeasOrder = (options: GetIdeasOrderOptions) => {
  const { listID, staleTime, gcTime, enabled } =
    getIdeasOrderSchema.parse(options);

  const query = listsQuery.getIdeasOrder.useQuery(
    listsKeys.ideasOrder(listID),
    {
      params: { listID },
    },
    {
      queryKey: listsKeys.ideasOrder(listID),
      staleTime,
      gcTime,
      enabled: enabled && !!listID,
    }
  );

  return {
    ...query,
    data: query.data?.body.content,
  };
};
