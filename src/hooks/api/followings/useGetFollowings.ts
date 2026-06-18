import { followingsQuery } from '@/api/query/followings';
import { followingsSchema } from '@/api/schemas/followings';
import followingsKeys from '@/hooks/api/followings/keys';
import z from 'zod';

const getFollowingsSchema = followingsSchema.getRequest.extend({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
});

type UseGetFollowingsOptions = z.input<typeof getFollowingsSchema>;

export const useGetFollowings = (options: UseGetFollowingsOptions) => {
  const { userID, staleTime, gcTime } = getFollowingsSchema.parse(options);

  const query = followingsQuery.get.useQuery(
    followingsKeys.user(userID),
    { query: { userID } },
    {
      queryKey: followingsKeys.user(userID),
      staleTime,
      gcTime,
      enabled: !!userID,
    }
  );

  return {
    ...query,
    data: query.data?.body.content,
  };
};
