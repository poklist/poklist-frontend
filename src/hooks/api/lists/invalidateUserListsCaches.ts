import { QueryClient } from '@tanstack/react-query';
import listsKeys from './keys';

/**
 * 編輯 / 刪除 List 後，保底重抓使用者的 List 列表 feed。
 *
 * 樂觀手術（updateInfiniteCaches）只有在 cache 仍在時有效；cache 被 gcTime
 * 回收後手術會 no-op，而 lists 的 GET query 皆關掉 refetchOnMount/Focus/Reconnect
 * （見 useGetInfiniteListsUnderUser / useGetUserLists），所以若不主動 invalidate，
 * 編輯後的 List 不會即時反映、刪除的 List 會留在列表，直到某次不相關的重抓。
 *
 * 用 refetchType 'inactive'（最省流量）：正在看的 active feed 靠呼叫端的手術即時
 * 更新、不重抓；只有 inactive feed 背景刷新；absent 靠掛載初次 fetch 兜底。
 * 注意：usePostNewList 對 feed 只 invalidate、沒有手術，故它仍用 'all'（active
 * feed 沒有手術可退回）；此處呼叫端（usePutList/useDeleteList）都有手術，故 'inactive'
 * 安全。詳見 ARCHITECTURE.md §4.5 / §13.2。
 */
export const invalidateUserListsCaches = (
  queryClient: QueryClient,
  userCode: string
) => {
  void queryClient.invalidateQueries({
    queryKey: listsKeys.userInfiniteLists(userCode),
    refetchType: 'inactive',
  });
};
