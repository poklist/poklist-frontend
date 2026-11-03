import { listsContract, usersContract } from '@/api/contracts';
import { GetUserListsResponse } from '@/api/query/lists';
import listsKeys from '@/hooks/api/lists/keys';
import publishKeys from '@/hooks/api/publish/keys';
import usersKeys from '@/hooks/api/users/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import { adjustPublishLimitsCache } from '@/hooks/queries/publish/cachesUpdater';
import { QueryClient } from '@tanstack/react-query';

/**
 * 建立 List 成功後更新快取（舊 POST /lists 與新 POST /creator/lists 共用）。
 *
 * - 名單 feed（infinite）：沒有手術，只 invalidate；refetchType 'all' 讓正在看的
 *   active feed 也重抓（見 invalidateUserListsCaches 的說明）。
 * - userLists：把新名單插到最前面；userInfo.listCount +1；發佈額度 +1。
 */
export const applyCreatedListToCaches = async (
  queryClient: QueryClient,
  userCode: string,
  newList: GetUserListsResponse['content'][number]
) => {
  await queryClient.invalidateQueries({
    queryKey: listsKeys.userInfiniteLists(userCode),
    refetchType: 'all',
  });
  updateEntryCaches<typeof listsContract.getUserListsContract>(
    queryClient,
    listsKeys.userLists(userCode),
    (previousBody) => ({
      ...previousBody,
      content: [newList, ...previousBody.content],
    })
  );
  updateEntryCaches<typeof usersContract.getInfoContract>(
    queryClient,
    usersKeys.userInfo(userCode),
    (previousBody) => ({
      ...previousBody,
      content: {
        ...previousBody.content,
        listCount: previousBody.content.listCount + 1,
      },
    })
  );
  adjustPublishLimitsCache(queryClient, publishKeys.listsLimits(), 1);
};
