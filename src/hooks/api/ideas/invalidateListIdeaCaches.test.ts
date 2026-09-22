import listsKeys from '@/hooks/api/lists/keys';
import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { invalidateListIdeaCaches } from './invalidateListIdeaCaches';
import ideasKeys from './keys';

describe('invalidateListIdeaCaches', () => {
  // 保底重抓兩支 ideas cache —— 修的是「cache 被 gcTime 回收後，變更不顯示」。
  it("invalidates both ideas caches with refetchType 'all' so changes surface on a cold cache", () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined);

    invalidateListIdeaCaches(queryClient, '100');

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ideasKeys.infiniteIdeasUnderList('100'),
        refetchType: 'all',
      })
    );
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: listsKeys.infiniteIdeas('100'),
        refetchType: 'all',
      })
    );
  });
});
