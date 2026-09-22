import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { invalidateUserListsCaches } from './invalidateUserListsCaches';
import listsKeys from './keys';

describe('invalidateUserListsCaches', () => {
  // 保底重抓使用者 List feed —— 修的是「cache 被 gcTime 回收後，編輯/刪除不反映」。
  it("invalidates the user's list feed with refetchType 'inactive' so edits/deletes surface on a cold cache", () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined);

    invalidateUserListsCaches(queryClient, 'usera');

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: listsKeys.userInfiniteLists('usera'),
        refetchType: 'inactive',
      })
    );
  });
});
