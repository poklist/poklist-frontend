import { useOfficialCollections } from '@/hooks/queries/useOfficialCollections';
import SectionTitle from '../SectionTitle';
import TileList from '../TileList';
import { OfficialCollection } from '@/types/Discovery';
import { t } from '@lingui/core/macro';
import TileSectionSkeleton from './TileSectionSkeleton';

const TileSection = () => {
  const { officialCollections = [], isLoading } = useOfficialCollections({});

  if (isLoading) {
    return <TileSectionSkeleton />;
  }

  return (
    <section className="flex flex-1 flex-col bg-white">
      <SectionTitle
        title={t`Fresh lists from our pocket`}
        subtitle={t`Updated weekly`}
      />
      <div className="grid grid-cols-2 gap-[10px] px-2 py-6">
        {officialCollections.map((officialCollection: OfficialCollection) => (
          <TileList
            key={officialCollection.id}
            officialCollection={officialCollection}
          />
        ))}
      </div>
    </section>
  );
};

export default TileSection;
