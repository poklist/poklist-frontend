import { Button } from '@/components/ui/button';
import useDeleteList from '@/hooks/Lists/useDeleteList';
import useEditList from '@/hooks/Lists/useEditList';
import { IListInfo, default as useGetList } from '@/hooks/Lists/useGetList';
import Header from '@/pages/Lists/Components/Header';
import IdeaList from '@/pages/Lists/Manage/IdeasList';
import ListInfo from '@/pages/Lists/Manage/ListInfo';
import useCommonStore from '@/stores/useCommonStore';
import useLayoutStore from '@/stores/useLayoutStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/macro';
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
      const response = await fetchDeleteList(listInfo.id);
      if (response === null) {
        navigate(`/${userStore.user.userCode}`);
      }
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
    if (id) fetchGetListInfo(id);
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
      <Header title={<Trans>List Title</Trans>} deleteCallback={onDeleteList} />
      <Link to={`/list/edit/${id}`}>
        <ListInfo listInfo={listInfo} />
      </Link>
      <div className="flex h-12 items-center justify-between bg-black px-4 text-white">
        <div className="text-t1">
          <Trans>Ideas</Trans>
        </div>
        <div className="text-t2">
          <Trans>Tap to edit. Hold & drag to reorder Ideas</Trans>
        </div>
      </div>
      <div className="p-4">
        <Link
          to={'/idea/create'}
          state={{ listID: Number(id), listTitle: listInfo?.title }}
        >
          <Button
            className="w-full text-h2 font-bold"
            variant="highlighted"
            shape="rounded8px"
          >
            <Trans>Add an idea</Trans>
          </Button>
        </Link>
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
    </>
  );
};

export default ListManagePage;
