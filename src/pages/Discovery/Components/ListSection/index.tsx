import { useCategories } from '@/hooks/queries/useCategories';
import ListItem from '../ListItem';
import SectionTitle from '../SectionTitle';
import { useLatestListGroups } from '@/hooks/queries/useLatestListGroups';
import { useMemo, useState } from 'react';
import { LatestList } from '@/types/Discovery';
import { Trans } from '@lingui/react/macro';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';

const CATEGORY_TITLES: Record<string, string> = {
  lifestyle: 'Lists that vibe right',
  food: 'Lists that taste like wow',
  culture: 'Lists that show your colors',
  traveling: 'Lists that go to places',
  entertainment: 'Lists that stream good times',
  technology: 'Lists that tap into the future',
  growth: 'Lists that build better you',
  health: 'Lists that make you sweat',
  others: 'Lists that just get it',
};

// initial display count
const INITIAL_DISPLAY_COUNT = 5;
// expanded display count
const EXPANDED_DISPLAY_COUNT = 10;

const ListSection = () => {
  const { categories } = useCategories();
  const { latestListGroups = {} } = useLatestListGroups({});

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const processedListGroups = useMemo(() => {
    const result: Record<string, LatestList[]> = {};
    Object.entries(latestListGroups).forEach(([key, value]) => {
      result[key] = value;
    });
    return result;
  }, [latestListGroups]);

  // expand category
  const expandCategory = (categoryId: number | string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: true,
    }));
  };

  return (
    <section className="flex flex-1 flex-col bg-white">
      {categories.map((category) => {
        const categoryNameLower = category.name.toLowerCase();
        const lists = processedListGroups[categoryNameLower] || [];

        // TODO: if no lists under this category, show nothing.
        if (lists.length === 0) return null;

        // decide how many lists to display based on expanded state
        const isExpanded = expandedCategories[category.id];
        const displayLists = isExpanded
          ? lists.slice(0, INITIAL_DISPLAY_COUNT + EXPANDED_DISPLAY_COUNT)
          : lists.slice(0, INITIAL_DISPLAY_COUNT);

        // decide if show expand button
        const showExpandButton =
          lists.length > INITIAL_DISPLAY_COUNT && !isExpanded;

        return (
          <div key={category.id}>
            <SectionTitle
              title={CATEGORY_TITLES[categoryNameLower]}
              subtitle={category.name}
            />
            <Trans>
              <h2 className="p-4 text-h2 font-bold text-black-text-01">
                Recently updated
              </h2>
            </Trans>
            <div className="flex flex-col">
              {displayLists.map((list) => (
                <ListItem key={list.id} listItem={list} />
              ))}
            </div>

            {/* expand button, only show when not expanded and has more content */}
            {showExpandButton && (
              <div className="flex justify-center pb-6 pt-2">
                <Button
                  variant={ButtonVariant.SUB_ACTIVE}
                  size={ButtonSize.H38}
                  shape={ButtonShape.ROUNDED_FULL}
                  onClick={() => expandCategory(category.id)}
                >
                  <Trans>See more</Trans>
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ListSection;
