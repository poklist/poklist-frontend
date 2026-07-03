import { publishContracts } from '@/api/contracts';
import { publishQuery } from '@/api/query/publish';
import { publishSchema } from '@/api/schemas';
import publishKeys from '@/hooks/api/publish/keys';
import { ErrorResponse } from '@ts-rest/react-query';
import z from 'zod';

const getIdeasLimitsOptionsSchema = publishSchema.getIdeasLimitsRequest.extend({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
  enabled: z.boolean(),
});

type GetIdeasLimitsOptions = z.input<typeof getIdeasLimitsOptionsSchema> & {
  onError?: (
    error: ErrorResponse<typeof publishContracts.getIdeasLimitsContract>
  ) => void;
};

export const useGetIdeasLimits = (options: GetIdeasLimitsOptions) => {
  const { listID, staleTime, gcTime, enabled } =
    getIdeasLimitsOptionsSchema.parse(options);
  // const { onError } = options;

  const query = publishQuery.getIdeasLimits.useQuery(
    publishKeys.ideasLimits(listID),
    { query: { listID } },
    {
      queryKey: publishKeys.ideasLimits(listID),
      staleTime,
      gcTime,
      enabled,
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
