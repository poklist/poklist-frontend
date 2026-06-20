import { GetFollowersRequest } from '@/api/query/followers';

const followersKeys = {
  all: ['followers'],
  user: (userID: GetFollowersRequest['userID']) => [
    ...followersKeys.all,
    'user',
    userID,
  ],
};

export default followersKeys;
