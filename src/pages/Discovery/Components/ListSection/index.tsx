import { useCategories } from '@/hooks/queries/useCategories';
import ListItem from '../ListItem';
import SectionTitle from '../SectionTitle';
import { useLatestListGroups } from '@/hooks/queries/useLatestListGroups';
import { useMemo, useState } from 'react';
import { LatestList } from '@/types/Discovery';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import ListSectionSkeleton from './ListSectionSkeleton';

// initial display count
const INITIAL_DISPLAY_COUNT = 5;
// expanded display count
const EXPANDED_DISPLAY_COUNT = 10;

const ListSection = () => {
  const CATEGORY_NAMES: Record<string, string> = {
    lifestyle: t`Lifestyle`,
    food: t`Food & Drink`,
    culture: t`Culture`,
    traveling: t`Travel`,
    entertainment: t`Entertainment`,
    technology: t`Tech & Digital`,
    growth: t`Personal Growth`,
    health: t`Health & Fitness`,
    others: t`Others`,
  };
  const CATEGORY_TITLES: Record<string, string> = {
    lifestyle: t`Lists that vibe right`,
    food: t`Lists that taste like wow`,
    culture: t`Lists that show your colors`,
    traveling: t`Lists that go to places`,
    entertainment: t`Lists that stream good times`,
    technology: t`Lists that tap into the future`,
    growth: t`Lists that build better you`,
    health: t`Lists that make you sweat`,
    others: t`Lists that just get it`,
  };

  const { categories, categoriesLoading } = useCategories();
  const { latestListGroups = {}, isLoading: groupsLoading } =
    useLatestListGroups({});
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

  if (categoriesLoading || groupsLoading) {
    return <ListSectionSkeleton />;
  }

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
              subtitle={CATEGORY_NAMES[categoryNameLower]}
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
