import { GetPublishIdeasLimitsRequest } from '@/api/query/publish';

const publishKeys = {
  all: ['publish'],
  listsLimits: () => [...publishKeys.all, 'listsLimits'],
  ideasLimits: (listID: GetPublishIdeasLimitsRequest['listID']) => [
    ...publishKeys.all,
    'ideasLimits',
    listID,
  ],
};

export default publishKeys;
