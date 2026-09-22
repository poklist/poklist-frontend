import { InfiniteCache } from '@/api/fetcher';
import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { applyCreatedIdeaToCaches } from './applyCreatedIdeaToCaches';
import ideasKeys from './keys';

type IdeasUnderListBody = { ideas: { id: string }[]; ideaTotalCount: number };

const makeCreatedIdea = (
  overrides: Partial<{ id: string; listID: string }> = {}
) => ({
  id: overrides.id ?? 'new-idea',
  listID: overrides.listID ?? '100',
  title: 'New Idea',
  description: '',
  coverImage: '',
  externalLink: '',
});

const seedIdeasUnderList = (
  queryClient: QueryClient,
  listID: string,
  ideas: { id: string }[]
) => {
  const cache: InfiniteCache<IdeasUnderListBody> = {
    pages: [
      {
        status: 200,
        body: { ideas, ideaTotalCount: ideas.length },
        headers: new Headers(),
      },
    ],
    pageParams: [0],
  };
  queryClient.setQueryData(ideasKeys.infiniteIdeasUnderList(listID), cache);
};

describe('applyCreatedIdeaToCaches', () => {
  it('optimistically prepends the created idea when the ideas cache is live', () => {
    const queryClient = new QueryClient();
    // invalidate 不參與此案例的斷言 —— mock 掉避免觸發背景重抓污染輸出
    vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined);
    seedIdeasUnderList(queryClient, '100', [{ id: 'old-idea' }]);

    applyCreatedIdeaToCaches(queryClient, makeCreatedIdea());

    const cache = queryClient.getQueryData<InfiniteCache<IdeasUnderListBody>>(
      ideasKeys.infiniteIdeasUnderList('100')
    );
    expect(cache?.pages[0].body.ideas.map((i) => i.id)).toEqual([
      'new-idea',
      'old-idea',
    ]);
    expect(cache?.pages[0].body.ideaTotalCount).toBe(2);
  });

  // 重現 bug：cache 被 gcTime 回收後，樂觀手術 no-op（updateInfiniteCaches 遇
  // !caches 直接 return），且 ideas query 關掉 refetchOnMount，所以新 Idea 不會
  // 顯示。修法保底 invalidateQueries 觸發重抓，讓新 Idea 必然浮現。
  it('invalidates the ideas-under-list query so a created idea surfaces even when its cache was garbage-collected', () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined);
    // 不 seed cache —— 模擬已被回收 / 冷 query

    applyCreatedIdeaToCaches(queryClient, makeCreatedIdea({ listID: '100' }));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ideasKeys.infiniteIdeasUnderList('100'),
        refetchType: 'inactive',
      })
    );
  });
});
