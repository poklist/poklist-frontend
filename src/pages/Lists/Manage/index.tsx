import { Button } from '@/components/ui/button';
import useGetList from '@/hooks/Lists/useGetList';
import { Header } from '@/pages/Lists/Manage/Header';
import IdeaList from '@/pages/Lists/Manage/IdeasList';
import ListInfo from '@/pages/Lists/Manage/ListInfo';
import useCommonStore from '@/stores/useCommonStore';
import { Trans } from '@lingui/macro';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface ManageListPageProps {
  // Add any props you need for the page
}

const ListManagePage: React.FC<ManageListPageProps> = () => {
  const { id } = useParams();
  const { setIsLoading } = useCommonStore();

  const { isListInfoLoading, listInfo, fetchGetListInfo } = useGetList();

  useEffect(() => {
    if (id) fetchGetListInfo(id);
  }, [id]);

  useEffect(() => {
    if (isListInfoLoading) {
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
      <IdeaList ideaList={listInfo?.ideas} />
    </>
  );
};

export default ListManagePage;
