import {
  GetIdeasOrderRequest,
  GetListsRequest,
  GetUserListsRequest,
} from '@/api/query/lists';

const listsKeys = {
  all: ['lists'],
  list: (listID: GetListsRequest['listID']) => [
    ...listsKeys.all,
    'list',
    listID,
  ],
  userLists: (userCode: GetUserListsRequest['userCode']) => [
    ...listsKeys.all,
    'userLists',
    userCode,
  ],
  userInfiniteLists: (userCode: GetUserListsRequest['userCode']) => [
    ...listsKeys.all,
    'userInfiniteLists',
    userCode,
  ],
  ideasOrder: (listID: GetIdeasOrderRequest['listID']) => [
    ...listsKeys.all,
    'ideasOrder',
    listID,
  ],
  infiniteIdeas: (listID: GetListsRequest['listID']) => [
    ...listsKeys.all,
    'infiniteIdeas',
    listID,
  ],
};

export default listsKeys;
