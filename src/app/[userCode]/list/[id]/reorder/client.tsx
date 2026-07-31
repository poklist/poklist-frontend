'use client';

import { GetListsResponse } from '@/api/query/lists';
import IdeaList, {
  DropEvent,
} from '@/app/[userCode]/list/[id]/reorder/_components/IdeasList';
import EditModeHeader from '@/components/Header/EditModeHeader';
import { useGetInfiniteIdeasUnderList } from '@/hooks/api/ideas/useGetInfiniteIdeasUnderList';
import { useGetIdeasOrder } from '@/hooks/api/lists/useGetIdeasOrder';
import { usePostIdeasReorder } from '@/hooks/api/lists/usePostIdeasReorder';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';
import useUserStore from '@/stores/useUserStore';
import { t } from '@lingui/macro';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const ReorderIdeaPage: React.FC = () => {
  const { userCode } = useUserRouteContext();
  const params = useParams();
  const listID = params.id as string;

  const navigateTo = useStrictNavigationAdapter();
  const { withAuth } = useAuthWrapper();
  const { checkAuthAndRedirect } = useAuthCheck();

  const { me } = useUserStore();
  const [ideasDraft, setIdeasDraft] =
    useState<GetListsResponse['content']['ideas']>();
  const [isOrderModified, setIsOrderModified] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteIdeasUnderList({
      listID,
      // enabled: !isDeleting,
      limit: 20,
    });

  const { data: orderedIdeas } = useGetIdeasOrder({
    listID,
  });
  const { mutate: reorderIdeas } = usePostIdeasReorder({
    listID,
    limit: orderedIdeas?.length ?? 20,
  });

  useEffect(() => {
    if (!data?.pages) return;

    const newIdeas = data.pages
      .flatMap((page) => page.ideas)
      .filter((idea): idea is GetListsResponse['content']['ideas'][number] =>
        Boolean(idea)
      );

    setIdeasDraft((prevDraft) => {
      if (!isOrderModified || !prevDraft) return newIdeas;

      const existingIds = new Set(prevDraft.map((idea) => idea.id));
      const newItems = newIdeas.filter((idea) => !existingIds.has(idea.id));
      return newItems.length === 0 ? prevDraft : [...prevDraft, ...newItems];
    });
  }, [data, isOrderModified]);

  const onReorder = withAuth(
    useCallback(
      (event: DropEvent<GetListsResponse['content']['ideas'][number]>) => {
        if (!event.changed) return;
        setIdeasDraft(event.list);
        setIsOrderModified(true);
      },
      []
    )
  );

  const onConfirmReorder = withAuth(() => {
    if (!listID || !ideasDraft || !orderedIdeas) return;

    const draftSet = new Set(ideasDraft.map((idea) => idea.id));
    const finalOrder = [
      ...ideasDraft.map((idea) => idea.id),
      ...orderedIdeas.filter((ideaID) => !draftSet.has(ideaID)),
    ];

    reorderIdeas(
      { params: { listID }, body: { ideaOrder: finalOrder } },
      { onSuccess: () => setIsOrderModified(false) }
    );
  });

  const onBottomReached = () => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };

  useEffect(() => {
    checkAuthAndRedirect();
    if (userCode !== me.userCode) {
      if (userCode) {
        if (listID) {
          navigateTo.viewList(userCode, listID);
        } else {
          navigateTo.user(userCode);
        }
      } else {
        navigateTo.home();
      }
    }
  }, [checkAuthAndRedirect, listID, me.userCode, navigateTo, userCode]);

  useEffect(() => {
    if (ideasDraft && ideasDraft.length < 20) {
      onBottomReached();
    }
  }, [ideasDraft?.length]);

  return (
    <>
      <EditModeHeader
        onClose={() => navigateTo.backward()}
        title={t`Reorder Ideas`}
        disabled={!isOrderModified}
        onSave={() => onConfirmReorder()}
        saveButtonText={t`Done`}
      />
      <div className="flex min-h-screen flex-col">
        <IdeaList
          ideaList={ideasDraft}
          reorderCallback={onReorder}
          onBottomCallback={onBottomReached}
          hasMore={hasNextPage}
        />
      </div>
    </>
  );
};

export default ReorderIdeaPage;
