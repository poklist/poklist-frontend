import { QueryClient } from '@tanstack/react-query';
import listsKeys from './keys';

/**
 * 編輯 / 刪除 List 後，保底重抓使用者的 List 列表 feed。
 *
 * 樂觀手術（updateInfiniteCaches）只有在 cache 仍在時有效；cache 被 gcTime
 * 回收後手術會 no-op，而 lists 的 GET query 皆關掉 refetchOnMount/Focus/Reconnect
 * （見 useGetInfiniteListsUnderUser / useGetUserLists），所以若不主動 invalidate，
 * 編輯後的 List 不會即時反映、刪除的 List 會留在列表，直到某次不相關的重抓。
 * refetchType 'all' 連 inactive query 也一併刷新。與 usePostNewList 既有做法一致。
 * 詳見 ARCHITECTURE.md §4.5 / §13.2。
 */
export const invalidateUserListsCaches = (
  queryClient: QueryClient,
  userCode: string
) => {
  void queryClient.invalidateQueries({
    queryKey: listsKeys.userInfiniteLists(userCode),
    refetchType: 'all',
  });
};
