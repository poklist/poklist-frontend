import { Skeleton } from '@radix-ui/themes';

const TileListSkeleton = ({
  headerLineNumber = 1,
}: {
  headerLineNumber?: number;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <header className="flex flex-col justify-start gap-1">
        {Array.from({ length: headerLineNumber }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-32" />
        ))}
      </header>
      <div>
        <Skeleton className="size-[202px] rounded-lg border border-black object-cover" />
      </div>
      <footer className="flex flex-row items-center justify-start gap-1">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </footer>
    </div>
  );
};

export default TileListSkeleton;
