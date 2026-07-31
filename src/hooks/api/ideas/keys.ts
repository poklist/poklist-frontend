import { GetIdeasRequest, GetIdeasUnderListRequest } from '@/api/query/ideas';

const ideasKeys = {
  all: ['ideas'],
  idea: (ideaID: GetIdeasRequest['ideaID']) => [
    ...ideasKeys.all,
    'idea',
    String(ideaID),
  ],
  infiniteIdeasUnderList: (listID: GetIdeasUnderListRequest['listID']) => [
    ...ideasKeys.all,
    'infiniteIdeasUnderList',
    listID,
  ],
};

export default ideasKeys;
