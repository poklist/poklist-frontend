import listsKeys from '@/hooks/api/lists/keys';
import { QueryClient } from '@tanstack/react-query';
import ideasKeys from './keys';

/**
 * 建立 / 編輯 / 刪除 Idea 後，保底重抓該 List 的兩支 ideas cache。
 *
 * 樂觀手術（updateInfiniteCaches）只有在 cache 仍在時有效；cache 被 gcTime
 * 回收後手術會 no-op，而 ideas 兩支 query 皆關掉 refetchOnMount/Focus/Reconnect
 * （見 useGetInfiniteIdeasUnderList / useGetListInfiniteIdeas），所以若不主動
 * invalidate，變更會直到某次不相關的重抓才顯示。refetchType 'all' 連
 * inactive（使用者稍後才返回的 List 頁）的 query 也一併刷新。
 * 詳見 ARCHITECTURE.md §4.5 / §13.2。
 */
export const invalidateListIdeaCaches = (
  queryClient: QueryClient,
  listID: string
) => {
  void queryClient.invalidateQueries({
    queryKey: ideasKeys.infiniteIdeasUnderList(listID),
    refetchType: 'all',
  });
  void queryClient.invalidateQueries({
    queryKey: listsKeys.infiniteIdeas(listID),
    refetchType: 'all',
  });
};
