import { GetIdeasRequest } from '@/api/query/ideas';

const ideasKeys = {
  all: ['ideas'],
  idea: (ideaID: GetIdeasRequest['ideaID']) => [
    ...ideasKeys.all,
    'idea',
    String(ideaID),
  ],
};

export default ideasKeys;
