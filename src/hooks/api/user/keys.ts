import { GetUserInfoRequest } from '@/api/query/user';

const userKeys = {
  all: ['user'],
  userInfo: (userCode: GetUserInfoRequest['userCode']) => [
    ...userKeys.all,
    'userInfo',
    userCode,
  ],
};
export default userKeys;
