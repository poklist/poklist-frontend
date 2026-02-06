import { Skeleton } from '@radix-ui/themes';

const ListCardSkeleton: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center rounded-[32px] border border-black bg-white pb-10 pt-6">
      <div className="flex w-full flex-col items-center px-4">
        {/* Recently Updated */}
        <Skeleton className="mb-2 flex h-7 w-5/12 items-center justify-center rounded-full px-4" />
        {/* Listing since */}
        <Skeleton className="h-5 w-1/2" />
        {/* List Title */}
        <Skeleton className="mt-4 h-10 w-full" />
        <div className="mt-4 flex w-full justify-center gap-2 text-sm">
          {/* List Category & Liked */}
          <Skeleton className="h-5 w-5/12" />
        </div>
        {/* List Description */}
        <Skeleton className="mt-6 w-full" />
        {/* List External Link */}
        <div className="mt-4 flex h-8 w-full cursor-pointer items-center gap-2 self-start">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-full" />
        </div>
        {/* List Cover Photo */}
        <Skeleton className="mt-4 h-[374px] w-[374px] rounded-xl border border-black" />
      </div>
      <div className="mt-4 w-full">
        {/* Add Idea */}
        <div className="flex min-h-16 items-center gap-2.5 border-b border-t border-gray-main-03 p-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
      <div className="flex w-full flex-col">
        {/* Idea */}
        <div className="flex min-h-16 w-full items-center justify-between gap-2 border-t border-gray-main-03 p-4 first:border-t-0 last:pb-0">
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="w-9/12" />
            <Skeleton className="w-full" />
          </div>
          <Skeleton className="min-h-16 min-w-16 rounded-lg border border-black-text-01" />
        </div>
        <div className="flex min-h-16 w-full items-center justify-between gap-2 border-t border-gray-main-03 p-4 first:border-t-0 last:pb-0">
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="w-9/12" />
            <Skeleton className="w-full" />
          </div>
          <Skeleton className="min-h-16 min-w-16 rounded-lg border border-black-text-01" />
        </div>
        <div className="flex min-h-16 w-full items-center justify-between gap-2 border-t border-gray-main-03 p-4 first:border-t-0 last:pb-0">
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="w-9/12" />
            <Skeleton className="w-full" />
          </div>
          <Skeleton className="min-h-16 min-w-16 rounded-lg border border-black-text-01" />
        </div>
      </div>
    </div>
  );
};

export default ListCardSkeleton;
