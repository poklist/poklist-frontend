import { GetFollowingsRequest } from '@/api/query/followings';

const followingsKeys = {
  all: ['followings'],
  user: ({ userID }: GetFollowingsRequest) => [
    ...followingsKeys.all,
    'user',
    userID,
  ],
};

export default followingsKeys;
