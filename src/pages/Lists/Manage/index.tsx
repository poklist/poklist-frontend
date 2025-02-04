import { Button } from '@/components/ui/button';
import useEditList from '@/hooks/Lists/useEditList';
import useGetList, { IListInfo } from '@/hooks/Lists/useGetList';
import useIsMobile from '@/hooks/useIsMobile';
import { Header } from '@/pages/Lists/Manage/Header';
import IdeaList from '@/pages/Lists/Manage/IdeasList';
import ListInfo from '@/pages/Lists/Manage/ListInfo';
import useCommonStore from '@/stores/useCommonStore';
import { Trans } from '@lingui/macro';
import { useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Link, useParams } from 'react-router-dom';

interface ManageListPageProps {
  // Add any props you need for the page
}

const ListManagePage: React.FC<ManageListPageProps> = () => {
  const { id } = useParams();
  const { setIsLoading } = useCommonStore();
  const isMobile = useIsMobile();

  const { isListInfoLoading, listInfo, setListInfo, fetchGetListInfo } =
    useGetList();
  const { fetchReorderIdea, editListLoading } = useEditList();

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
    } else {
      setIsLoading(false);
    }
  }, [isListInfoLoading]);
  return (
    <>
      <Header title={<Trans>List Title</Trans>} />
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
