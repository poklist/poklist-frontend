import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import { useDeleteList } from '@/hooks/mutations/useDeleteList';
import { useReorderIdeas } from '@/hooks/mutations/useReorderIdeas';
import { useInfiniteList } from '@/hooks/queries/infinite/useInfiniteList';
import { useOrderIdeas } from '@/hooks/queries/useOrderIdeas';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigation from '@/hooks/useStrictNavigate';
import { UserRouteLayoutContextType } from '@/pages/Layout/UserRouteLayuout';
import Header from '@/pages/Lists/Components/Header';
import IdeaList, { DropEvent } from '@/pages/Lists/Manage/IdeasList';
import ListInfo from '@/pages/Lists/Manage/ListInfo';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaPreview } from '@/types/Idea';
import { Trans } from '@lingui/react/macro';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
const ListManagePage: React.FC = () => {
  const { userCode } = useOutletContext<UserRouteLayoutContextType>();

  const { id } = useParams();
  const navigateTo = useStrictNavigation();
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
    listID: id,
    enabled: !isDeleting,
    limit: 20,
  });

  const { data: orderedIdeas, isLoading: isOrderIdeaLoading } = useOrderIdeas({
    listID: id ?? '',
  });
  const { reorderIdeas, isReorderIdeasLoading } = useReorderIdeas({
    listID: id ?? '',
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
    if (!id || !ideasDraft || !orderedIdeas) return;

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
    if (!id) return navigateTo.error();
    navigateTo.editList(me.userCode, id);
  });

  const onAddIdea = withAuth(() => {
    if (!id) return navigateTo.error();
    navigateTo.createIdea({
      state: { listID: Number(id), listTitle: list?.title },
    });
  });

  const onClose = () => {
    if (!id) return navigateTo.error();
    navigateTo.viewList(me.userCode, id);
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
        if (id) {
          navigateTo.viewList(userCode, id);
        } else {
          navigateTo.user(userCode);
        }
      } else {
        navigateTo.home();
      }
    }
  }, [checkAuthAndRedirect, id, me.userCode, navigateTo, userCode]);

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
