import { followersQuery } from '@/api/query/followers';
import { followersSchema } from '@/api/schemas/followers';
import followersKeys from '@/hooks/api/followers/keys';
import z from 'zod';

const getFollowersSchema = followersSchema.getRequest.extend({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
});

type UseGetFollowersOptions = z.input<typeof getFollowersSchema>;

export const useGetFollowers = (options: UseGetFollowersOptions) => {
  const { userID, staleTime, gcTime } = getFollowersSchema.parse(options);

  const query = followersQuery.get.useQuery(
    followersKeys.user(userID),
    {
      query: { userID },
    },
    {
      queryKey: followersKeys.user(userID),
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
