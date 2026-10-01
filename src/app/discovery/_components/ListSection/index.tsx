import ListItem from '@/app/discovery/_components/ListItem';
import ListSectionSkeleton from '@/app/discovery/_components/ListSection/ListSectionSkeleton';
import SectionTitle from '@/app/discovery/_components/SectionTitle';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { useGetCategories } from '@/hooks/api/categories/useGetCategories';
import { useGetLatestListGroups } from '@/hooks/api/discovery/useGetLatestListGroups';
import { useUIStore } from '@/stores/useUIStore';
import { LatestList } from '@/types/Discovery';
import { t, Trans } from '@lingui/macro';
import { useEffect, useMemo, useRef, useState } from 'react';

// initial display count
const INITIAL_DISPLAY_COUNT = 5;
// expanded display count
const EXPANDED_DISPLAY_COUNT = 10;

// 存儲節點ID，用於檢測返回訪問
const SESSION_VISITED_KEY = 'discovery_list_section_visited';

const ListSection = () => {
  const CATEGORY_NAMES: Record<string, string> = {
    lifestyle: t`生活風格`,
    food: t`美食`,
    culture: t`文化`,
    traveling: t`旅遊`,
    entertainment: t`娛樂`,
    technology: t`數位科技`,
    growth: t`個人成長`,
    health: t`健康與健身`,
    others: t`其他`,
  };
  const CATEGORY_TITLES: Record<string, string> = {
    lifestyle: t`這 vibe 我可以`,
    food: t`好想吃吃喝喝`,
    culture: t`有點溫度的東西`,
    traveling: t`出去玩耍的私筆記`,
    entertainment: t`耳機一戴，世界走開`,
    technology: t`正在生成的浪潮`,
    growth: t`慢慢懂的一些事`,
    health: t`練出好狀態`,
    others: t`喜歡的都在這`,
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
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { data: latestListGroups, isLoading: groupsLoading } =
    useGetLatestListGroups({
      enabled: isVisible,
    });

  const processedListGroups = useMemo(() => {
    if (!latestListGroups) return;
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
        const lists = processedListGroups?.[categoryNameLower] || [];

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
                最近更新
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
                  <Trans>展開更多</Trans>
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
