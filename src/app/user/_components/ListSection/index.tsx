'use client';

import { ListSectionSkeleton } from '@/app/user/_components/ListSection/ListSectionSkeleton';
import { useGetUserLists } from '@/hooks/api/lists/useGetUserLists';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';
import { Trans } from '@lingui/macro';
import Image from 'next/image';

const ListSection: React.FC = () => {
  const { userCode } = useUserRouteContext();
  const navigateTo = useStrictNavigationAdapter();

  const { data: listPreviews, isLoading } = useGetUserLists({
    userCode,
    limit: 99,
  });

  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isLoading: isListsLoading,
  //   isFetchingNextPage,
  // } = useInfiniteLists({ userCode, limit: 5 });

  // const [lists, setLists] = useState<ListPreview[]>();

  if (isLoading || !listPreviews) {
    return <ListSectionSkeleton />;
  }

  // useEffect(() => {
  //   if (!data?.pages) return;

  //   const newLists = data.pages
  //     .flatMap((page) => page.list)
  //     .filter((list): list is ListPreview => Boolean(list));

  //   setLists((prevLists) => {
  //     if (!prevLists) return newLists;

  //     const existingIds = new Set(prevLists.map((list) => list.id));
  //     const newIdeaList = newLists.filter((list) => !existingIds.has(list.id));
  //     return newIdeaList.length === 0
  //       ? prevLists
  //       : [...prevLists, ...newIdeaList];
  //   });
  // }, [data]);

  // const onBottomReached = () => {
  //   if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  // };

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
              <p className="break-normal text-t1 font-semibold text-black-text-01 [overflow-wrap:anywhere]">
                {listPreview.title}
              </p>
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
        {/* {lists && (
          <VirtualList
            dataKey="id"
            dataSource={lists}
            onBottom={() => onBottomReached()}
          >
            {(list, _index, dataKey) => (
              <div
                key={dataKey}
                className={`flex min-h-[72px] items-center justify-between border-black-text-01 p-4 -tracking-1.1%`}
                onClick={() => {
                  navigateTo.viewList(userCode, list.id.toString());
                }}
              >
                <p className="text-t1 font-semibold text-black-text-01 break-words [line-break:anywhere]">
                  {list.title}
                </p>
                {list.coverImage && (
                  <Image
                    src={list.coverImage || ''}
                    alt={list.title}
                    width={40}
                    height={40}
                    className="rounded-[3px] border border-black-text-01"
                  />
                )}
              </div>
            )}
          </VirtualList>
        )} */}
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
