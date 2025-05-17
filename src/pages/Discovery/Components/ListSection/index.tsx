import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { useCategories } from '@/hooks/queries/useCategories';
import { useLatestListGroups } from '@/hooks/queries/useLatestListGroups';
import { useUIStore } from '@/stores/useUIStore';
import { LatestList } from '@/types/Discovery';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useEffect, useMemo, useRef, useState } from 'react';
import ListItem from '../ListItem';
import SectionTitle from '../SectionTitle';
import ListSectionSkeleton from './ListSectionSkeleton';

// initial display count
const INITIAL_DISPLAY_COUNT = 5;
// expanded display count
const EXPANDED_DISPLAY_COUNT = 10;

// 存儲節點ID，用於檢測返回訪問
const SESSION_VISITED_KEY = 'discovery_list_section_visited';

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

  // 從 UIStore 獲取展開類別的狀態與方法
  const { expandedCategories, expandCategory } = useUIStore();

  // 懶加載相關狀態
  const [isVisible, setIsVisible] = useState(() => {
    // 檢查是否為返回訪問
    const hasVisitedBefore =
      sessionStorage.getItem(SESSION_VISITED_KEY) === 'true';
    // 返回訪問直接設為可見，避免與ScrollRestoration衝突
    return hasVisitedBefore;
  });
  const sectionRef = useRef(null);

  // 記錄訪問狀態
  useEffect(() => {
    // 標記已訪問，便於下次返回時判斷
    sessionStorage.setItem(SESSION_VISITED_KEY, 'true');

    // 如果有指定滾動位置但內容尚未載入，需要先設為可見
    if (
      window.location.hash ||
      (window.history.state && 'scroll' in window.history.state)
    ) {
      setIsVisible(true);
    }

    // 清理函數
    return () => {
      // 組件卸載時不要清除訪問狀態，以便返回時識別
    };
  }, []);

  // 使用 Intersection Observer 檢測組件是否進入視口
  useEffect(() => {
    // 如果已經可見，不需要再觀察
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isVisible]);

  // 只在組件可見時加載數據
  const { categories, categoriesLoading } = useCategories();
  const { latestListGroups = {}, isLoading: groupsLoading } =
    useLatestListGroups({
      enabled: isVisible,
    });

  const processedListGroups = useMemo(() => {
    const result: Record<string, LatestList[]> = {};
    Object.entries(latestListGroups).forEach(([key, value]) => {
      result[key] = value;
    });
    return result;
  }, [latestListGroups]);

  // 如果組件還不可見，顯示一個占位符
  if (!isVisible) {
    return <div ref={sectionRef} className="min-h-[200px]" />;
  }

  // 數據加載中顯示骨架屏
  if (categoriesLoading || groupsLoading) {
    return <ListSectionSkeleton />;
  }

  return (
    <section ref={sectionRef} className="flex flex-1 flex-col bg-white">
      {categories?.map((category) => {
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
