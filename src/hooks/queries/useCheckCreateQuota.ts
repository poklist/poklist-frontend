import { listsQuery } from '@/api/query/lists';
import {
  GetPublishIdeasLimitsRequest,
  publishQuery,
} from '@/api/query/publish';
import listsKeys from '@/hooks/api/lists/keys';
import publishKeys from '@/hooks/api/publish/keys';
import useUserStore from '@/stores/useUserStore';
import { useQueryClient } from '@tanstack/react-query';

export const useCheckCreateQuota = () => {
  const queryClient = useQueryClient();
  const { me } = useUserStore();
  const canStillCreate = (limits: {
    isUnlimited: boolean;
    remainingCount: number | null;
  }) => limits.isUnlimited || (limits.remainingCount ?? 0) > 0;

  const checkCanCreate = async (
    targetListID?: GetPublishIdeasLimitsRequest['listID']
  ): Promise<boolean> => {
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

    const ideaLimits = await Promise.all(
      userLists.map((list) =>
        publishQuery.getIdeasLimits.fetchQuery(
          queryClient,
          publishKeys.ideasLimits(list.id),
          { query: { listID: list.id } }
        )
      )
    );

    return ideaLimits.some((response) => canStillCreate(response.body.content))
      ? true
      : false;
  };
  return {
    checkCanCreate,
  };
};
