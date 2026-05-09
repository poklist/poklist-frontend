import { ideasQuery } from '@/api/query/ideas';
import { ideasSchema } from '@/api/schemas/ideas';
import z from 'zod';
import ideasKeys from './keys';

const getIdeaSchema = ideasSchema.getRequest.extend({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
  enabled: z.boolean().default(true),
});

type UseGetIdeaOptions = z.input<typeof getIdeaSchema>;

export const useGetIdea = (options: UseGetIdeaOptions) => {
  const { ideaID, staleTime, gcTime, enabled } = getIdeaSchema.parse(options);

  const query = ideasQuery.get.useQuery(
    ideasKeys.idea(ideaID),
    { params: { ideaID } },
    {
      queryKey: ideasKeys.idea(ideaID),
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
