import listsKeys from '@/hooks/api/lists/keys';
import { QueryClient } from '@tanstack/react-query';
import ideasKeys from './keys';

/**
 * 建立 / 編輯 / 刪除 Idea 後，保底重抓該 List 的兩支 ideas cache。
 *
 * 樂觀手術（updateInfiniteCaches）只有在 cache 仍在時有效；cache 被 gcTime
 * 回收後手術會 no-op，而 ideas 兩支 query 皆關掉 refetchOnMount/Focus/Reconnect
 * （見 useGetInfiniteIdeasUnderList / useGetListInfiniteIdeas），所以若不主動
 * invalidate，變更會直到某次不相關的重抓才顯示。
 *
 * 用 refetchType 'inactive'（最省流量）：正在看的 active query 靠上面的手術
 * 即時更新、不重抓；只有 inactive（使用者稍後才返回的 List 頁）query 背景刷新；
 * 完全被回收的 absent query 則靠返回時掛載的初次 fetch 兜底。呼叫端每個 key
 * 都有對應手術，故 active 情形不會漏。詳見 ARCHITECTURE.md §4.5 / §13.2。
 */
export const invalidateListIdeaCaches = (
  queryClient: QueryClient,
  listID: string
) => {
  void queryClient.invalidateQueries({
    queryKey: ideasKeys.infiniteIdeasUnderList(listID),
    refetchType: 'inactive',
  });
  void queryClient.invalidateQueries({
    queryKey: listsKeys.infiniteIdeas(listID),
    refetchType: 'inactive',
  });
};
