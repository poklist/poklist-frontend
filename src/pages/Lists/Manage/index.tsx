import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import useDeleteList from '@/hooks/Lists/useDeleteList';
import useEditList from '@/hooks/Lists/useEditList';
import { IListInfo, default as useGetList } from '@/hooks/Lists/useGetList';
import Header from '@/pages/Lists/Components/Header';
import IdeaList from '@/pages/Lists/Manage/IdeasList';
import ListInfo from '@/pages/Lists/Manage/ListInfo';
import useCommonStore from '@/stores/useCommonStore';
import useLayoutStore from '@/stores/useLayoutStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/react/macro';
import { useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface ManageListPageProps {
  // Add any props you need for the page
}

const ListManagePage: React.FC<ManageListPageProps> = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { setIsLoading } = useCommonStore();
  const userStore = useUserStore();
  const isMobile = useLayoutStore((state) => state.isMobile);
  const { isListInfoLoading, listInfo, setListInfo, fetchGetListInfo } =
    useGetList();
  const { fetchReorderIdea, editListLoading } = useEditList();
  const { deleteListLoading, fetchDeleteList } = useDeleteList();

  const onDeleteList = async () => {
    if (listInfo) {
      // TODO: error handling
      await fetchDeleteList(listInfo.id);
      navigate(`/${userStore.user.userCode}`);
      setIsLoading(false);
    }
  };

  const onReorderIdea = useCallback((dragIndex: number, hoverIndex: number) => {
    setListInfo((previousListInfo: IListInfo | undefined) => {
      if (!previousListInfo?.ideas) return previousListInfo;
      const ideaOrderList = [...previousListInfo.ideas];
      const [reorderIdea] = ideaOrderList.splice(dragIndex, 1);
      ideaOrderList.splice(hoverIndex, 0, reorderIdea);
      return {
        ...previousListInfo,
        ideas: ideaOrderList,
      };
    });
  }, []);

  const onConfirmReorderIdea = () => {
    if (id && listInfo?.ideas) {
      fetchReorderIdea(id, listInfo.ideas);
    }
  };

  useEffect(() => {
    if (id) fetchGetListInfo(id, 0, 99);
  }, [id]);

  useEffect(() => {
    if (isListInfoLoading) {
      setIsLoading(true);
    } else if (editListLoading) {
      setIsLoading(true);
    } else if (deleteListLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isListInfoLoading, editListLoading, deleteListLoading]);
  return (
    <>
      <Header title={<Trans>Idea List</Trans>} deleteCallback={onDeleteList} />
      <div className="flex min-h-screen flex-col">
        <ListInfo listInfo={listInfo} />
        <div className="mb-6 px-4">
          <Link to={`/${userStore.user.userCode}/list/${id}/edit`}>
            <Button
              className="w-full text-[17px] font-bold"
              variant={ButtonVariant.BLACK}
              shape={ButtonShape.ROUNDED_8PX}
            >
              <Trans>Edit list cover</Trans>
            </Button>
          </Link>
        </div>
        <div className="mb-4 px-4">
          <Link
            to={'/idea/create'}
            state={{ listID: Number(id), listTitle: listInfo?.title }}
          >
            <Button
              className="w-full text-[17px] font-bold"
              variant={ButtonVariant.HIGHLIGHTED}
              shape={ButtonShape.ROUNDED_8PX}
            >
              <Trans>Add an idea</Trans>
            </Button>
          </Link>
        </div>
        <div className="mb-4 px-4 text-[15px] text-black-gray-03">
          {listInfo?.ideas === undefined || listInfo.ideas.length <= 0 ? (
            <Trans>
              Newly created idea will be shown below, let's add one!
            </Trans>
          ) : (
            <Trans>Tap to edit. Hold & drag to reorder Ideas</Trans>
          )}
        </div>
        {isMobile ? (
          <DndProvider
            backend={TouchBackend}
            options={{ enableMouseEvents: true }}
          >
            <IdeaList
              ideaList={listInfo?.ideas}
              reorderCallback={onReorderIdea}
              confirmReorderCallback={onConfirmReorderIdea}
            />
          </DndProvider>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <IdeaList
              ideaList={listInfo?.ideas}
              reorderCallback={onReorderIdea}
              confirmReorderCallback={onConfirmReorderIdea}
            />
          </DndProvider>
        )}
      </div>
      <footer className="sticky bottom-0 left-0 z-10 flex w-full justify-between border-t border-t-gray-main-03 bg-white px-4 py-2 md:max-w-mobile-max">
        <div className="flex items-center gap-2">
          <Link
            aria-label="Previous"
            className="h-auto rounded-full bg-inherit p-0"
            to={`/${userStore.user.userCode}/list/${id}`}
          >
            <IconClose />
          </Link>
          <Trans>Edit List</Trans>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={onConfirmReorderIdea}
            variant={ButtonVariant.SUB_ACTIVE}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Save New Order</Trans>
          </Button>
          <Button
            onClick={onConfirmReorderIdea}
            variant={ButtonVariant.BLACK}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Done</Trans>
          </Button>
        </div>
      </footer>
    </>
  );
};

export default ListManagePage;
