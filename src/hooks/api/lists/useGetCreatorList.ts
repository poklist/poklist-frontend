import { creatorListsQuery } from '@/api/query/creatorLists';
import listsKeys from '@/hooks/api/lists/keys';

interface UseGetCreatorListOptions {
  listID: string;
  enabled?: boolean;
}

// GET /creator/lists/:listId 的編輯設定（BE §6）。每次進入都重抓，避免用到舊的 editToken
export const useGetCreatorList = ({
  listID,
  enabled = true,
}: UseGetCreatorListOptions) => {
  const query = creatorListsQuery.get.useQuery(
    listsKeys.editSettings(listID),
    { params: { listID } },
    {
      queryKey: listsKeys.editSettings(listID),
      staleTime: 0,
      refetchOnMount: 'always',
      enabled: enabled && !!listID,
    }
  );

  return {
    ...query,
    data: query.data?.body.content,
  };
};
