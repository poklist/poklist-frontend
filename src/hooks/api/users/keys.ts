import { GetUserInfoRequest } from '@/api/query/users';

const usersKeys = {
  all: ['users'],
  userInfo: (userCode: GetUserInfoRequest['userCode']) => [
    ...usersKeys.all,
    'userInfo',
    userCode,
  ],
};
export default usersKeys;
