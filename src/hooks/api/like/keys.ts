import { PostLikeRequest } from '@/api/query/like';

const likeKeys = {
  all: ['like'],
  mutations: () => [...likeKeys.all, 'mutations'],
  post: (listID: PostLikeRequest['listID']) => [
    ...likeKeys.mutations(),
    'post',
    listID,
  ],
};

export default likeKeys;
