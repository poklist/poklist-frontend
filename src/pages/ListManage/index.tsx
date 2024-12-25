import { Button } from '@/components/ui/button';
import { Header } from '@/pages/ListManage/Header';
import IdeaListSection from '@/pages/ListManage/IdeasList';
import { ListInfoSection } from '@/pages/ListManage/ListInfo';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';

interface ListsPageProps {
  // Add any props you need for the page
}

const ListsPage: React.FC<ListsPageProps> = () => {
  return (
    <>
      <Header title={<Trans>List Title</Trans>} />
      <ListInfoSection />
      <div className="bg-black text-white flex justify-between px-4 items-center h-12">
        <div className="text-t1">
          <Trans>Ideas</Trans>
        </div>
        <div className="text-t2">
          <Trans>Tap to edit. Hold & drag to reorder Ideas</Trans>
        </div>
      </div>
      <div className="p-4">
        <Link to={'/idea/create'}>
          <Button className="text-h2 font-bold w-full" variant="highlighted" shape="rounded8px">
            <Trans>Add an idea</Trans>
          </Button>
        </Link>
      </div>
      <IdeaListSection />
    </>
  );
};

export default ListsPage;
