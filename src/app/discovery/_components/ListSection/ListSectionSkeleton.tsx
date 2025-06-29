import { Skeleton } from '@radix-ui/themes';
import SectionTitleSkeleton from '../SectionTitle/SectionTitleSkeleton';
import ListItemSkeleton from '../ListItem/ListItemSkeleton';

const CATEGORY_COUNT = 9;
const LIST_ITEM_COUNT = 5;

const ListSectionSkeleton: React.FC = () => {
  return (
    <section className="flex flex-1 flex-col bg-white">
      {Array.from({ length: CATEGORY_COUNT }).map((_, catIdx) => (
        <div key={catIdx}>
          <SectionTitleSkeleton />
          <div className="p-4">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col">
            {Array.from({ length: LIST_ITEM_COUNT }).map((_, idx) => (
              <ListItemSkeleton key={idx} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ListSectionSkeleton;
