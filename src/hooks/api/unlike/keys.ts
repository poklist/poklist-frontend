import { PostUnlikeRequest } from '@/api/query/unlike';

const unlikeKeys = {
  all: ['unlike'],
  mutations: () => [...unlikeKeys.all, 'mutations'],
  post: (listID: PostUnlikeRequest['listID']) => [
    ...unlikeKeys.mutations(),
    'post',
    listID,
  ],
};

export default unlikeKeys;
