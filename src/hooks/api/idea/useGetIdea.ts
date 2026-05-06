import { ideaQuery } from '@/api/query/idea';
import { ideaSchema } from '@/api/schemas/idea';
import z from 'zod';
import ideaKeys from './keys';

const getIdeaSchema = z.object({
  ideaID: ideaSchema.getRequest.shape.ideaID,
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
  enabled: z.boolean().default(true),
});

type UseGetIdeaOptions = z.input<typeof getIdeaSchema>;

export const useGetIdea = (options: UseGetIdeaOptions) => {
  const { ideaID, staleTime, gcTime, enabled } = getIdeaSchema.parse(options);

  const query = ideaQuery.get.useQuery(
    ideaKeys.idea({ ideaID }),
    { params: { ideaID } },
    {
      queryKey: ideaKeys.idea({ ideaID }),
      staleTime,
      gcTime,
      enabled: enabled && !!ideaID,
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
