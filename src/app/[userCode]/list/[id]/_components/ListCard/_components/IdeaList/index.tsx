import { GetListsResponse } from '@/api/query/lists';
import { useGetListInfiniteIdeas } from '@/hooks/api/lists/useGetListInfiniteIdeas';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface IdeaListProps {
  listID: string;
  onClickIdea: (id: string) => void;
}

export const IdeaList: React.FC<IdeaListProps> = ({
  listID,
  onClickIdea,
}: IdeaListProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [ideasDraft, setIdeasDraft] =
    useState<GetListsResponse['content']['ideas']>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetListInfiniteIdeas({ listID, limit: 20 });

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

  useEffect(() => {
    if (!data?.pages) return;

    const newIdeas = data.pages
      .flatMap((page) => page.ideas)
      .filter((idea): idea is GetListsResponse['content']['ideas'][number] =>
        Boolean(idea)
      );

    setIdeasDraft((prevDraft) => {
      if (!prevDraft) return newIdeas;

      const newIds = new Set(newIdeas.map((idea) => idea.id));
      const hasRemovals = prevDraft.some((idea) => !newIds.has(idea.id));
      if (hasRemovals) return newIdeas;

      const existingIds = new Set(prevDraft.map((idea) => idea.id));
      const newItems = newIdeas.filter((idea) => !existingIds.has(idea.id));
      return newItems.length === 0 ? prevDraft : [...prevDraft, ...newItems];
    });
  }, [data]);

  if (isLoading) return <IdeaListSkeleton />;
  if (isError) return <IdeaListError />;

  if (ideasDraft?.length === 0) return null;

  return (
    <div className="flex w-full flex-col">
      {ideasDraft?.map((idea) => (
        <div
          key={idea.id}
          className="flex min-h-[65px] items-center justify-between gap-2 border-t border-gray-main-03 p-4 -tracking-1.1% first:border-t-0 last:pb-0"
          onClick={() => onClickIdea(idea.id)}
        >
          <div
            className={cn(
              'flex flex-col gap-2',
              idea.coverImage ? 'w-[calc(100%-72px)]' : 'w-full'
            )}
          >
            <p className="break-words text-[15px] font-semibold text-black-text-01 [line-break:anywhere]">
              {idea.title}
            </p>
            {idea.description && (
              <p className="line-clamp-1 block truncate text-[13px] text-gray-storm-01">
                {idea.description}
              </p>
            )}
          </div>
          {idea.coverImage && (
            <Image
              src={idea.coverImage}
              alt={idea.title}
              width={64}
              height={64}
              className="rounded-lg border border-black-text-01"
            />
          )}
        </div>
      ))}
      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <IdeaListSkeletonRow />
        </div>
      )}
    </div>
  );
};
const IdeaListSkeletonRow: React.FC = () => (
  <div className="flex min-h-[65px] w-full animate-pulse items-center gap-4 border-t border-gray-main-03 p-4 first:border-t-0">
    <div className="flex flex-1 flex-col gap-2">
      <div className="h-4 w-3/4 rounded bg-gray-main-03" />
      <div className="h-3 w-1/2 rounded bg-gray-main-03" />
    </div>
  </div>
);

const IdeaListSkeleton: React.FC = () => (
  <div className="flex w-full flex-col">
    {Array.from({ length: 3 }).map((_, i) => (
      <IdeaListSkeletonRow key={i} />
    ))}
  </div>
);

const IdeaListError: React.FC = () => (
  <div className="py-6 text-center text-[13px] text-gray-storm-01">
    Failed to load ideas.
  </div>
);
