import { Skeleton } from '@radix-ui/themes';
import { ChevronRight } from 'lucide-react';

const ListItemSkeleton = () => {
  return (
    <div className="flex flex-row items-center justify-between border-t border-gray-02 p-4">
      <div className="flex flex-row items-center justify-start gap-2">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <ChevronRight className="h-5 w-5" />
    </div>
  );
};

export default ListItemSkeleton;
