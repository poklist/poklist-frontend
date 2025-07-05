import SectionTitle from '@/app/discovery/_components/SectionTitle';
import TileList from '@/app/discovery/_components/TileList';
import TileSectionSkeleton from '@/app/discovery/_components/TileSection/TileSectionSkeleton';
import { useOfficialCollections } from '@/hooks/queries/useOfficialCollections';
import { OfficialCollection } from '@/types/Discovery';
import { t } from '@lingui/core/macro';
import { useEffect, useRef, useState } from 'react';

const TileSection = () => {
  const { officialCollections = [], isLoading } = useOfficialCollections({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const minCardWidth = 202;
        const gap = 10;
        const newColumns = Math.max(
          2,
          Math.floor((containerWidth + gap) / (minCardWidth + gap))
        );
        setColumns(Math.min(newColumns, 4));
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  if (isLoading) {
    return <TileSectionSkeleton />;
  }

  // 將項目分配到各列
  const distributeItems = () => {
    const cols = Array.from(
      { length: columns },
      () => [] as OfficialCollection[]
    );

    officialCollections.forEach((item: OfficialCollection, index: number) => {
      const colIndex = index % columns;
      cols[colIndex].push(item);
    });

    return cols;
  };

  const columnArrays = distributeItems();

  return (
    <section className="flex flex-1 flex-col bg-white">
      <SectionTitle
        title={t`Fresh lists from our pocket`}
        subtitle={t`Updated weekly`}
      />
      <div ref={containerRef} className="flex gap-2.5 px-2 py-6">
        {columnArrays.map((columnItems, columnIndex) => (
          <div key={columnIndex} className="flex flex-1 flex-col gap-4">
            {columnItems.map((officialCollection) => (
              <div key={officialCollection.id} className="flex justify-center">
                <TileList officialCollection={officialCollection} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TileSection;
