import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import { useDeleteList } from '@/hooks/mutations/useDeleteList';
import { useReorderIdeas } from '@/hooks/mutations/useReorderIdeas';
import { useList } from '@/hooks/queries/useList';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import Header from '@/pages/Lists/Components/Header';
import IdeaList, { DropEvent } from '@/pages/Lists/Manage/IdeasList';
import ListInfo from '@/pages/Lists/Manage/ListInfo';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaPreview } from '@/types/Idea';
import { Trans } from '@lingui/react/macro';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ListManagePage: React.FC = () => {
  const { id } = useParams();
  const navigateTo = useStrictNavigate();

  const { setIsLoading } = useCommonStore();
  const { me } = useUserStore();

  const [isDeleting, setIsDeleting] = useState(false);
  const [ideasDraft, setIdeasDraft] = useState<IdeaPreview[]>();
  const [isOrderModified, setIsOrderModified] = useState(false);

  const { data: list, isLoading: isListLoading } = useList({
    listID: id,
    enabled: !isDeleting,
  });

  const { reorderIdeas, isReorderIdeasLoading } = useReorderIdeas({
    listID: id ?? '',
  });

  const { deleteList, isDeleteListLoading } = useDeleteList({
    userCode: me.userCode,
  });

  const onDeleteList = () => {
    if (!list) return;
    // TODO: error handling
    setIsDeleting(true);
    deleteList(list.id, {
      onSuccess: () => {
        navigateTo.user(me.userCode);
        setIsLoading(false);
      },
    });
  };

  const onReorderIdea = useCallback((event: DropEvent<IdeaPreview>) => {
    if (!event.changed) return;
    setIdeasDraft(event.list);
  }, []);

  const onConfirmReorderIdea = () => {
    if (!id || !ideasDraft) return;
    reorderIdeas(
      { ideaOrder: ideasDraft.map((idea) => idea.id) },
      {
        onSuccess: () => {
          setIsOrderModified(false);
        },
      }
    );
  };

  useEffect(() => {
    if (!list) return;
    setIdeasDraft(list.ideas);
  }, [list]);

  useEffect(() => {
    if (!ideasDraft || !list?.ideas) return;
    const isModified = ideasDraft.some(
      (idea, index) => idea.id !== list.ideas[index]?.id
    );
    setIsOrderModified(isModified);
  }, [ideasDraft, list?.ideas]);

  useEffect(() => {
    if (isListLoading || isReorderIdeasLoading || isDeleteListLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isListLoading, isReorderIdeasLoading, isDeleteListLoading]);

  const atEditList = () => {
    if (!id) return navigateTo.error();
    navigateTo.editList(me.userCode, id);
  };

  const atAddIdea = () => {
    if (!id) return navigateTo.error();
    navigateTo.createIdea({
      state: {
        listID: Number(id),
        listTitle: list?.title,
      },
    });
  };

  const atClose = () => {
    if (!id) return navigateTo.error();
    navigateTo.viewList(me.userCode, id);
  };

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
            onClick={() => atEditList()}
          >
            <Trans>Edit list cover</Trans>
          </Button>
        </div>
        <div className="mb-4 px-4">
          <Button
            className="w-full text-[17px] font-bold"
            variant={ButtonVariant.HIGHLIGHTED}
            shape={ButtonShape.ROUNDED_8PX}
            onClick={() => atAddIdea()}
          >
            <Trans>Add an idea</Trans>
          </Button>
        </div>
        <div className="mb-4 px-4 text-[15px] text-black-gray-03">
          {!ideasDraft || ideasDraft.length === 0 ? (
            <Trans>Your ideas live here. Create one!</Trans>
          ) : (
            <Trans>Tap to edit. Hold & drag to reorder Ideas</Trans>
          )}
        </div>
        <IdeaList ideaList={ideasDraft} reorderCallback={onReorderIdea} />
      </div>
      <footer className="fixed bottom-0 left-0 z-10 flex w-full justify-between border-t border-t-gray-main-03 bg-white px-4 py-2 sm:sticky md:max-w-mobile-max">
        <div className="flex items-center gap-2">
          <IconClose onClick={() => atClose()} />
          <Trans>Edit List</Trans>
        </div>
        <div className="flex items-center gap-4">
          <Button
            disabled={!isOrderModified}
            onClick={onConfirmReorderIdea}
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
