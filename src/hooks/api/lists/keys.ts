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
  // GET /creator/lists/:listId 的編輯設定（含 editToken）
  editSettings: (listID: GetListsRequest['listID']) => [
    ...listsKeys.all,
    'editSettings',
    listID,
  ],
};

export default listsKeys;
