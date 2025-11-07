'use client';

import IdeaList, {
  DropEvent,
} from '@/app/[userCode]/list/[id]/reorder/_components/IdeasList';
import EditModeHeader from '@/components/Header/EditModeHeader';
import { useReorderIdeas } from '@/hooks/mutations/useReorderIdeas';
import { useInfiniteIdea } from '@/hooks/queries/infinite/useInfiniteIdea';
import { useOrderIdeas } from '@/hooks/queries/useOrderIdeas';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaPreview } from '@/types/Idea';
import { t } from '@lingui/core/macro';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const ReorderIdeaPage: React.FC = () => {
  const { userCode } = useUserRouteContext();
  const params = useParams();
  const listID = params?.id as string;

  const navigateTo = useStrictNavigationAdapter();
  const { withAuth } = useAuthWrapper();
  const { checkAuthAndRedirect } = useAuthCheck();

  const { me } = useUserStore();
  const { setIsLoading } = useCommonStore();
  const [ideasDraft, setIdeasDraft] = useState<IdeaPreview[]>();
  const [isOrderModified, setIsOrderModified] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: isListLoading,
    isFetchingNextPage,
  } = useInfiniteIdea({
    listID,
    // enabled: !isDeleting,
    limit: 20,
  });

  const { data: orderedIdeas, isLoading: isOrderIdeaLoading } = useOrderIdeas({
    listID: listID ?? '',
  });
  const { reorderIdeas, isReorderIdeasLoading } = useReorderIdeas({
    listID: listID ?? '',
  });

  useEffect(() => {
    if (!data?.pages) return;

    const newIdeas = data.pages
      .flatMap((page) => page.ideas)
      .filter((idea): idea is IdeaPreview => Boolean(idea));

    setIdeasDraft((prevDraft) => {
      if (!isOrderModified || !prevDraft) return newIdeas;

      const existingIds = new Set(prevDraft.map((idea) => idea.id));
      const newItems = newIdeas.filter((idea) => !existingIds.has(idea.id));
      return newItems.length === 0 ? prevDraft : [...prevDraft, ...newItems];
    });
  }, [data, isOrderModified]);

  const onReorder = withAuth(
    useCallback((event: DropEvent<IdeaPreview>) => {
      if (!event.changed) return;
      setIdeasDraft(event.list);
      setIsOrderModified(true);
    }, [])
  );

  const onConfirmReorder = withAuth(() => {
    if (!listID || !ideasDraft || !orderedIdeas) return;

    const draftSet = new Set(ideasDraft.map((idea) => idea.id));
    const finalOrder = [
      ...ideasDraft.map((idea) => idea.id),
      ...orderedIdeas.filter((ideaID) => !draftSet.has(ideaID)),
    ];

    reorderIdeas(
      { ideaOrder: finalOrder },
      { onSuccess: () => setIsOrderModified(false) }
    );
  });

  const onBottomReached = () => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };

  useEffect(() => {
    if (isListLoading || isOrderIdeaLoading || isReorderIdeasLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isListLoading, isOrderIdeaLoading, isReorderIdeasLoading]);

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
