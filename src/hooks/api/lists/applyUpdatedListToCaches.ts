import { listsContract } from '@/api/contracts';
import { GetUserListsResponse } from '@/api/query/lists';
import { invalidateUserListsCaches } from '@/hooks/api/lists/invalidateUserListsCaches';
import listsKeys from '@/hooks/api/lists/keys';
import { updateEntryCaches, updateInfiniteCaches } from '@/hooks/api/utils';
import { toBackendTimestamp } from '@/lib/time';
import { QueryClient } from '@tanstack/react-query';

type UserList = GetUserListsResponse['content'][number];

// coverImage 為 null／undefined 時沿用快取內的值
export type UpdatedList = Pick<
  UserList,
  'id' | 'title' | 'description' | 'externalLink' | 'categoryID' | 'type'
> & { coverImage?: string | null };

/**
 * 編輯 List 成功後更新快取（舊 PUT /lists 與新 PATCH /creator/lists 共用）。
 *
 * - userLists、userInfiniteLists、該 List 的 infiniteIdeas：直接手術改寫。
 * - 保底重抓：cache 被 gcTime 回收後上面的手術會 no-op（見 helper）。
 *   feed（使用者 List 列表）+ 該 List 詳細頁 meta。detail meta 上面已手術，
 *   故用 'inactive'（active 靠手術、只背景刷 inactive）。
 */
export const applyUpdatedListToCaches = (
  queryClient: QueryClient,
  userCode: string,
  updated: UpdatedList
) => {
  const updatedAt = toBackendTimestamp(new Date());
  updateEntryCaches<typeof listsContract.getUserListsContract>(
    queryClient,
    listsKeys.userLists(userCode),
    (previousBody) => {
      return {
        ...previousBody,
        content: previousBody.content.map((list) =>
          list.id === updated.id
            ? {
                ...list,
                title: updated.title,
                description: updated.description,
                coverImage: updated.coverImage ?? list.coverImage,
                externalLink: updated.externalLink,
                categoryID: updated.categoryID,
                type: updated.type,
              }
            : list
        ),
      };
    }
  );
  updateInfiniteCaches<typeof listsContract.getUserListsContract>(
    queryClient,
    listsKeys.userInfiniteLists(userCode),
    (previousPages) => {
      return previousPages.map((page) => {
        return {
          ...page,
          body: {
            ...page.body,
            content: page.body.content.map((list) =>
              list.id === updated.id
                ? {
                    ...list,
                    title: updated.title,
                    description: updated.description,
                    coverImage: updated.coverImage ?? list.coverImage,
                    externalLink: updated.externalLink,
                    categoryID: updated.categoryID,
                    type: updated.type,
                  }
                : list
            ),
          },
        };
      });
    }
  );
  updateInfiniteCaches<typeof listsContract.getListsContract>(
    queryClient,
    listsKeys.infiniteIdeas(updated.id),
    (previousPages) => {
      return previousPages.map((page) => {
        return {
          ...page,
          body: {
            ...page.body,
            content: {
              ...page.body.content,
              title: updated.title,
              description: updated.description,
              coverImage: updated.coverImage ?? page.body.content.coverImage,
              externalLink: updated.externalLink,
              categoryID: updated.categoryID,
              type: updated.type,
              updatedAt,
            },
          },
        };
      });
    }
  );
  invalidateUserListsCaches(queryClient, userCode);
  void queryClient.invalidateQueries({
    queryKey: listsKeys.infiniteIdeas(updated.id),
    refetchType: 'inactive',
  });
};
