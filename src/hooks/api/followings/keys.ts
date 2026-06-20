import { GetFollowingsRequest } from '@/api/query/followings';

const followingsKeys = {
  all: ['followings'],
  user: (userID: GetFollowingsRequest['userID']) => [
    ...followingsKeys.all,
    'user',
    userID,
  ],
};

export default followingsKeys;
