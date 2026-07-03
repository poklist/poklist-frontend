import { publishContracts } from '@/api/contracts';
import { publishQuery } from '@/api/query/publish';
import publishKeys from '@/hooks/api/publish/keys';
import { ErrorResponse } from '@ts-rest/react-query';
import z from 'zod';

const getListsLimitsOptionsSchema = z.object({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
});

type GetListsLimitsOptions = z.input<typeof getListsLimitsOptionsSchema> & {
  onError?: (
    error: ErrorResponse<typeof publishContracts.getListsLimitsContract>
  ) => void;
};

export const useGetListsLimits = (options: GetListsLimitsOptions) => {
  const { staleTime, gcTime } = getListsLimitsOptionsSchema.parse(options);
  // const { onError } = options;

  const query = publishQuery.getListsLimits.useQuery(
    publishKeys.listsLimits(),
    {},
    {
      queryKey: publishKeys.listsLimits(),
      staleTime,
      gcTime,
    }
  );

  // useEffect(() => {
  //   if (query.error && onError) {
  //     onError(query.error);
  //   }
  // }, [query.error, onError]);

  return {
    ...query,
    data: query.data?.body.content,
  };
};
