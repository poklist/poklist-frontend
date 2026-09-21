import { ideasContract, listsContract } from '@/api/contracts';
import { PostIdeasResponse } from '@/api/query/ideas';
import listsKeys from '@/hooks/api/lists/keys';
import publishKeys from '@/hooks/api/publish/keys';
import { updateInfiniteCaches } from '@/hooks/api/utils';
import { adjustPublishLimitsCache } from '@/hooks/queries/publish/cachesUpdater';
import { toBackendTimestamp } from '@/lib/time';
import { QueryClient } from '@tanstack/react-query';
import ideasKeys from './keys';

/**
 * 建立 Idea 成功後更新快取。
 *
 * 兩步：
 * 1. 樂觀手術（updateInfiniteCaches）：cache 仍在時即時把新 Idea 插進去。
 * 2. invalidateQueries：保底重抓，處理「cache 已被 gcTime 回收」或「手術落空」的情形。
 *    因為 ideas 兩支 query 皆關掉 refetchOnMount/Focus/Reconnect（見
 *    useGetInfiniteIdeasUnderList / useGetListInfiniteIdeas），若只靠手術，
 *    cache 不存在時 updateInfiniteCaches 會 no-op，新 Idea 就不會顯示直到
 *    某次不相關的重抓。refetchType 'all' 連 inactive（使用者稍後才返回的 List
 *    頁）的 query 也一併刷新。詳見 ARCHITECTURE.md §4.5 / §13.2。
 */
export const applyCreatedIdeaToCaches = (
  queryClient: QueryClient,
  data: PostIdeasResponse['content']
) => {
  const newIdea = {
    id: data.id,
    title: data.title,
    description: data.description,
    coverImage: data.coverImage,
    externalLink: data.externalLink,
  };

  updateInfiniteCaches<typeof listsContract.getListsContract>(
    queryClient,
    listsKeys.infiniteIdeas(data.listID),
    (previousPages) => {
      const updatedAt = toBackendTimestamp(new Date());
      return previousPages.map((page, index) => {
        const content = page.body.content;
        return {
          ...page,
          body: {
            ...page.body,
            totalElements: page.body.totalElements + 1,
            content: {
              ...content,
              ideaTotalCount: content.ideaTotalCount + 1,
              updatedAt,
              ideas: index === 0 ? [newIdea, ...content.ideas] : content.ideas,
            },
          },
        };
      });
    }
  );

  updateInfiniteCaches<typeof ideasContract.getIdeasUnderListContract>(
    queryClient,
    ideasKeys.infiniteIdeasUnderList(data.listID),
    (previousPages) =>
      previousPages.map((page, index) => ({
        ...page,
        body: {
          ...page.body,
          ideas: index === 0 ? [newIdea, ...page.body.ideas] : page.body.ideas,
          ideaTotalCount: page.body.ideaTotalCount + 1,
        },
      }))
  );

  adjustPublishLimitsCache(
    queryClient,
    publishKeys.ideasLimits(data.listID),
    1
  );

  // 保底：手術只在 cache 仍在時有效。cache 被 gcTime 回收後手術 no-op，
  // 且 ideas query 關掉 refetchOnMount，故必須主動 invalidate 觸發重抓，
  // 新 Idea 才會顯示。refetchType 'all' 連 inactive query 一併刷新。
  void queryClient.invalidateQueries({
    queryKey: ideasKeys.infiniteIdeasUnderList(data.listID),
    refetchType: 'all',
  });
  void queryClient.invalidateQueries({
    queryKey: listsKeys.infiniteIdeas(data.listID),
    refetchType: 'all',
  });
};
