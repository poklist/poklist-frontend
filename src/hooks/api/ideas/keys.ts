import { GetIdeasRequest } from '@/api/query/ideas';

const ideasKeys = {
  all: 'ideas',
  idea: ({ ideaID }: GetIdeasRequest) => [...ideasKeys.all, 'idea', ideaID],
};

export default ideasKeys;
