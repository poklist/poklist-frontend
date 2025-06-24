'use client';

import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import { useDeleteList } from '@/hooks/mutations/useDeleteList';
import { useReorderIdeas } from '@/hooks/mutations/useReorderIdeas';
import { useInfiniteList } from '@/hooks/queries/infinite/useInfiniteList';
import { useOrderIdeas } from '@/hooks/queries/useOrderIdeas';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateAdapter';
import { useUserContext } from '@/hooks/useRouterCompat';
import Header from '../../_components/Header';
import IdeaList, { DropEvent } from './_components/IdeasList';
import ListInfo from './_components/ListInfo';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaPreview } from '@/types/Idea';
import { Trans } from '@lingui/react/macro';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

const ListManagePage: React.FC = () => {
  const { userCode } = useUserContext();
  const params = useParams();
  const listID = params.id as string;

  const navigateTo = useStrictNavigationAdapter();
  const { withAuth } = useAuthWrapper();
  const { checkAuthAndRedirect } = useAuthCheck();

  const { me } = useUserStore();
  const { setIsLoading } = useCommonStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [ideasDraft, setIdeasDraft] = useState<IdeaPreview[]>();
  const [isOrderModified, setIsOrderModified] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: isListLoading,
    isFetchingNextPage,
  } = useInfiniteList({
    listID: listID,
    enabled: !isDeleting,
    limit: 20,
  });

  const { data: orderedIdeas, isLoading: isOrderIdeaLoading } = useOrderIdeas({
    listID: listID ?? '',
  });
  const { reorderIdeas, isReorderIdeasLoading } = useReorderIdeas({
    listID: listID ?? '',
  });
  const { deleteList, isDeleteListLoading } = useDeleteList({
    userCode: me.userCode,
  });

  const list = useMemo(() => data?.pages?.[0]?.listInfo, [data]);

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

  const onDeleteList = withAuth(() => {
    if (!list) return;
    setIsDeleting(true);
    deleteList(list.id, {
      onSuccess: () => {
        navigateTo.user(me.userCode);
        setIsLoading(false);
      },
    });
  });

  const onEditList = withAuth(() => {
    if (!listID) return navigateTo.error();
    navigateTo.editList(me.userCode, listID);
  });

  const onAddIdea = withAuth(() => {
    if (!listID) return navigateTo.error();
    navigateTo.createIdea({
      listID: Number(listID),
      listTitle: list?.title,
    });
  });

  const onClose = () => {
    if (!listID) return navigateTo.error();
    navigateTo.viewList(me.userCode, listID);
  };

  const onBottomReached = () => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };

  useEffect(() => {
    if (
      isListLoading ||
      isOrderIdeaLoading ||
      isReorderIdeasLoading ||
      isDeleteListLoading
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [
    isListLoading,
    isOrderIdeaLoading,
    isReorderIdeasLoading,
    isDeleteListLoading,
    setIsLoading,
  ]);

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

  if (isListLoading || isReorderIdeasLoading || isDeleteListLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header title={<Trans>Idea List</Trans>} deleteCallback={onDeleteList} />

      <div className="flex min-h-screen flex-col">
        <ListInfo listInfo={list} />

        <div className="mb-6 px-4">
          <Button
            className="w-full text-[17px] font-bold"
            variant={ButtonVariant.BLACK}
            shape={ButtonShape.ROUNDED_8PX}
            onClick={() => onEditList()}
          >
            <Trans>Edit list cover</Trans>
          </Button>
        </div>

        <div className="mb-4 px-4">
          <Button
            className="w-full text-[17px] font-bold"
            variant={ButtonVariant.HIGHLIGHTED}
            shape={ButtonShape.ROUNDED_8PX}
            onClick={() => onAddIdea()}
          >
            <Trans>Add an idea</Trans>
          </Button>
        </div>

        <div className="mb-4 px-4 text-[15px] text-black-gray-03">
          {!ideasDraft || ideasDraft.length === 0 ? (
            <Trans>Your ideas live here. Create one!</Trans>
          ) : (
            <Trans>
              Tap an idea to edit. Drag the lines on the left to reorder.
            </Trans>
          )}
        </div>

        <IdeaList
          ideaList={ideasDraft}
          reorderCallback={onReorder}
          onBottomCallback={onBottomReached}
          hasMore={hasNextPage}
        />
      </div>

      <footer className="fixed bottom-0 left-0 z-10 flex w-full justify-between border-t border-t-gray-main-03 bg-white px-4 py-2 sm:sticky md:max-w-mobile-max">
        <div className="flex items-center gap-2">
          <IconClose onClick={() => onClose()} />
          <Trans>Edit List</Trans>
        </div>
        <div className="flex items-center gap-4">
          <Button
            disabled={!isOrderModified}
            onClick={() => onConfirmReorder()}
            variant={ButtonVariant.BLACK}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Save New Order</Trans>
          </Button>
        </div>
      </footer>
    </>
  );
};

export default ListManagePage;
