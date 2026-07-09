import { publishContracts } from '@/api/contracts';
import { updateEntryCaches } from '@/hooks/api/utils';
import { QueryClient, QueryKey } from '@tanstack/react-query';

export const adjustPublishLimitsCache = (
  queryClient: QueryClient,
  key: QueryKey,
  delta: 1 | -1
) => {
  updateEntryCaches<typeof publishContracts.getListsLimitsContract>(
    queryClient,
    key,
    (previousBody) => ({
      ...previousBody,
      content: {
        ...previousBody.content,
        usedCount: previousBody.content.usedCount + delta,
        remainingCount:
          previousBody.content.remainingCount === null
            ? null // unlimited 用戶
            : previousBody.content.remainingCount - delta,
      },
    })
  );
};
