'use client';

import { ListSectionSkeleton } from '@/app/user/_components/ListSection/ListSectionSkeleton';
import IconPrivateEye from '@/components/ui/icons/PrivateEyeIcon';
import { ListType } from '@/enums/Lists/index.enum';
import { useGetInfiniteLists } from '@/hooks/api/lists/useGetInfiniteListsUnderUser';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';
import { Trans } from '@lingui/macro';
import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';

const ListSection: React.FC = () => {
  const { userCode } = useUserRouteContext();
  const navigateTo = useStrictNavigationAdapter();

  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetInfiniteLists({ userCode, limit: 10 });

  const onBottomReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onBottomReached();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onBottomReached, hasNextPage, isFetchingNextPage]);

  const listPreviews = data?.pages.flatMap((page) => page.lists);

  if (isLoading || !listPreviews) {
    return <ListSectionSkeleton />;
  }

  return (
    <div role="list-preview" className="mb-10 flex-1 bg-transparent sm:mb-0">
      <div className="flex flex-col bg-white">
        {listPreviews.map((listPreview, index) => {
          const isLastItem = index === listPreviews.length - 1;
          return (
            <div
              key={listPreview.id}
              className={`flex min-h-[72px] items-center justify-between ${
                isLastItem ? 'border-b-[3px]' : 'border-b'
              } border-black-text-01 p-4 -tracking-1.1%`}
              onClick={() => {
                navigateTo.viewList(userCode, listPreview.id.toString());
              }}
            >
              <div className="flex items-center gap-4">
                {listPreview.type === ListType.PRIVATE && (
                  <IconPrivateEye className="min-w-5" />
                )}
                <p className="break-normal text-t1 font-semibold text-black-text-01 [overflow-wrap:anywhere]">
                  {listPreview.title}
                </p>
              </div>
              {listPreview.coverImage && (
                <Image
                  src={listPreview.coverImage || ''}
                  alt={listPreview.title}
                  width={40}
                  height={40}
                  className="rounded-[3px] border border-black-text-01"
                />
              )}
            </div>
          );
        })}
        <div ref={sentinelRef} />
        {isFetchingNextPage && <ListSectionSkeleton />}
      </div>
      <div className="flex flex-col items-center">
        {listPreviews.length === 0 && (
          <div
            id="list-data-placeholder"
            className="mt-4 flex flex-col items-center text-t1 font-semibold text-black-text-01"
          >
            <p>
              <Trans>Looks like this page is a bit empty.</Trans>
            </p>
            <p>
              <Trans>Follow and check back soon for surprise lists!</Trans>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListSection;
