import { TileBackground } from '@/pages/User/TileBackground';
import { Skeleton } from '@radix-ui/themes';

const SectionTitleSkeleton = () => {
  return (
    <header className="relative w-full border-y border-black">
      <TileBackground />
      <div className="relative z-10 flex flex-col items-start justify-center gap-1 px-4 py-3">
        <Skeleton width="160px" height="24px" />
        <Skeleton width="100px" height="16px" />
      </div>
    </header>
  );
};

export default SectionTitleSkeleton;
