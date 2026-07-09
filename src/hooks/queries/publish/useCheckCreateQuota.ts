import { listsQuery } from '@/api/query/lists';
import {
  GetPublishIdeasLimitsRequest,
  publishQuery,
} from '@/api/query/publish';
import listsKeys from '@/hooks/api/lists/keys';
import publishKeys from '@/hooks/api/publish/keys';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { useQueryClient } from '@tanstack/react-query';

export const useCheckCreateQuota = () => {
  const queryClient = useQueryClient();
  const { me } = useUserStore();
  const { isLoggedIn } = useAuthStore();
  const canStillCreate = (limits: {
    isUnlimited: boolean;
    remainingCount: number | null;
  }) => limits.isUnlimited || (limits.remainingCount ?? 0) > 0;

  const checkCanCreate = async (
    targetListID?: GetPublishIdeasLimitsRequest['listID']
  ): Promise<boolean> => {
    if (!isLoggedIn) return false;
    if (targetListID) {
      const ideaLimit = (
        await publishQuery.getIdeasLimits.fetchQuery(
          queryClient,
          publishKeys.ideasLimits(targetListID),
          { query: { listID: targetListID } }
        )
      ).body.content;
      return canStillCreate(ideaLimit);
    }

    const lists = (
      await publishQuery.getListsLimits.fetchQuery(
        queryClient,
        publishKeys.listsLimits()
      )
    ).body.content;
    if (canStillCreate(lists)) return true;

    if (!me.userCode || me.userCode === '') return false;
    const userLists = (
      await listsQuery.getUserLists.fetchQuery(
        queryClient,
        listsKeys.userLists(me.userCode),
        {
          params: { userCode: me.userCode },
          query: { offset: 0, limit: lists.usedCount },
        }
      )
    ).body.content;

    for (const list of userLists) {
      const ideaLimit = (
        await publishQuery.getIdeasLimits.fetchQuery(
          queryClient,
          publishKeys.ideasLimits(list.id),
          { query: { listID: list.id } }
        )
      ).body.content;
      if (canStillCreate(ideaLimit)) return true;
    }
    return false;
  };

  const checkCanCreateList = async (): Promise<boolean> => {
    if (!isLoggedIn) return false;
    try {
      const listsLimits = (
        await publishQuery.getListsLimits.fetchQuery(
          queryClient,
          publishKeys.listsLimits()
        )
      ).body.content;
      return canStillCreate(listsLimits);
    } catch {
      return true;
    }
  };

  return {
    canStillCreate,
    checkCanCreate,
    checkCanCreateList,
  };
};
