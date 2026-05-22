import SectionTitleSkeleton from '@/app/discovery/_components/SectionTitle/SectionTitleSkeleton';
import TileListSkeleton from '@/app/discovery/_components/TileList/TileListSkeleton';

const TileSectionSkeleton: React.FC = () => {
  return (
    <section className="flex flex-1 flex-col bg-white">
      <SectionTitleSkeleton />
      <div className="grid grid-cols-2 gap-[10px] px-2 py-6">
        <TileListSkeleton headerLineNumber={2} />
        <TileListSkeleton headerLineNumber={1} />
        <TileListSkeleton headerLineNumber={2} />
        <TileListSkeleton headerLineNumber={1} />
      </div>
    </section>
  );
};

export default TileSectionSkeleton;
