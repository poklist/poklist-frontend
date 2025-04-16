import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import { useDeleteList } from '@/hooks/mutations/useDeleteList';
import { useReorderIdeas } from '@/hooks/mutations/useReorderIdeas';
import { useList } from '@/hooks/queries/useList';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import Header from '@/pages/Lists/Components/Header';
import IdeaList from '@/pages/Lists/Manage/IdeasList';
import ListInfo from '@/pages/Lists/Manage/ListInfo';
import useCommonStore from '@/stores/useCommonStore';
import useLayoutStore from '@/stores/useLayoutStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaPreview } from '@/types/Idea';
import { Trans } from '@lingui/react/macro';
import { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useParams } from 'react-router-dom';

interface ManageListPageProps {
  // Add any props you need for the page
}

const ListManagePage: React.FC<ManageListPageProps> = () => {
  const { id } = useParams();
  const navigateTo = useStrictNavigate();

  const { setIsLoading } = useCommonStore();
  const userStore = useUserStore();
  const isMobile = useLayoutStore((state) => state.isMobile);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: list, isLoading: isListLoading } = useList({
    listID: id,
    enabled: !isDeleting,
  });
  const [ideasDraft, setIdeasDraft] = useState<IdeaPreview[]>();

  const { reorderIdeas, isReorderIdeasLoading } = useReorderIdeas({
    listID: id ?? '',
  });
  const { deleteList, isDeleteListLoading } = useDeleteList({
    userCode: userStore.user.userCode,
  });

  const [isOrderModified, setIsOrderModified] = useState(false);

  const onDeleteList = async () => {
    if (list) {
      // TODO: error handling
      setIsDeleting(true);
      deleteList(list.id, {
        onSuccess: () => {
          navigateTo.user(userStore.user.userCode);
          setIsLoading(false);
        },
      });
    }
  };

  const onReorderIdea = useCallback((dragIndex: number, hoverIndex: number) => {
    setIdeasDraft((originalIdeas: IdeaPreview[] | undefined) => {
      if (!originalIdeas) return originalIdeas;
      const ideaOrderList = [...originalIdeas];
      const [reorderIdea] = ideaOrderList.splice(dragIndex, 1);
      ideaOrderList.splice(hoverIndex, 0, reorderIdea);
      return ideaOrderList;
    });
  }, []);

  const onConfirmReorderIdea = () => {
    if (id && ideasDraft) {
      reorderIdeas(
        { ideaOrder: ideasDraft.map((idea) => idea.id) },
        {
          onSuccess: () => {
            setIsOrderModified(false);
          },
        }
      );
    }
  };

  useEffect(() => {
    if (!list) return;
    setIdeasDraft(list.ideas);
  }, [list]);

  useEffect(() => {
    if (ideasDraft) {
      setIsOrderModified(false);
      for (let i = 0; i < ideasDraft.length; i++) {
        if (ideasDraft[i].id !== list?.ideas[i].id) {
          setIsOrderModified(true);
        }
      }
    }
  }, [ideasDraft]);

  useEffect(() => {
    if (isListLoading) {
      setIsLoading(true);
    } else if (isReorderIdeasLoading) {
      setIsLoading(true);
    } else if (isDeleteListLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isListLoading, isReorderIdeasLoading, isDeleteListLoading]);

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
            onClick={() =>
              id === undefined
                ? navigateTo.error()
                : navigateTo.editList(userStore.user.userCode, id)
            }
          >
            <Trans>Edit list cover</Trans>
          </Button>
        </div>
        <div className="mb-4 px-4">
          <Button
            className="w-full text-[17px] font-bold"
            variant={ButtonVariant.HIGHLIGHTED}
            shape={ButtonShape.ROUNDED_8PX}
            onClick={() =>
              id === undefined
                ? navigateTo.error()
                : navigateTo.createIdea({
                    state: {
                      listID: Number(id),
                      listTitle: list?.title,
                    },
                  })
            }
          >
            <Trans>Add an idea</Trans>
          </Button>
        </div>
        <div className="mb-4 px-4 text-[15px] text-black-gray-03">
          {ideasDraft === undefined || ideasDraft.length <= 0 ? (
            <Trans>Your ideas live here. Create one!</Trans>
          ) : (
            <Trans>Tap to edit. Hold & drag to reorder Ideas</Trans>
          )}
        </div>
        {isMobile ? (
          <DndProvider
            backend={TouchBackend}
            options={{ enableMouseEvents: true }}
          >
            <IdeaList ideaList={ideasDraft} reorderCallback={onReorderIdea} />
          </DndProvider>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <IdeaList ideaList={ideasDraft} reorderCallback={onReorderIdea} />
          </DndProvider>
        )}
      </div>
      <footer className="fixed bottom-0 left-0 z-10 flex w-full justify-between border-t border-t-gray-main-03 bg-white px-4 py-2 sm:sticky md:max-w-mobile-max">
        <div className="flex items-center gap-2">
          <IconClose
            onClick={() =>
              id === undefined
                ? navigateTo.error()
                : navigateTo.viewList(userStore.user.userCode, id)
            }
          />
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
