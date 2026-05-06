import { GetIdeaRequest } from '@/api/query/idea';

const ideaKeys = {
  all: 'idea',
  idea: ({ ideaID }: GetIdeaRequest) => [...ideaKeys.all, 'idea', ideaID],
};

export default ideaKeys;
