import { useListPreviews } from '@/hooks/queries/useLists';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import { UserRouteLayoutContextType } from '@/pages/Layout/UserRouteLayuout';
import { useOutletContext } from 'react-router-dom';
import { ListSectionSkeleton } from './ListSectionSkeleton';

const ListSection: React.FC = () => {
  const navigateTo = useStrictNavigate();
  const { userCode } = useOutletContext<UserRouteLayoutContextType>();

  const { data: listPreviews, isLoading } = useListPreviews({
    userCode,
  });

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
              key={listPreview.title}
              className={`flex min-h-[72px] items-center justify-between ${
                isLastItem ? 'border-b-[3px]' : 'border-b'
              } border-black-text-01 p-4 -tracking-1.1%`}
              onClick={() => {
                navigateTo.viewList(userCode, listPreview.id.toString());
              }}
            >
              <p className="text-[15px] font-semibold text-black-text-01">
                {listPreview.title}
              </p>
              {listPreview.coverImage && (
                <img
                  src={listPreview.coverImage}
                  width={40}
                  height={40}
                  className="rounded-[3px] border border-black-text-01"
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center">
        {listPreviews.length === 0 && (
          <div
            id="list-data-placeholder"
            className="mt-4 flex flex-col items-center text-[15px] font-semibold text-black-text-01"
          >
            <p>Looks like this pok is a bit empty.</p>
            <p>Follow and check back soon for surprise lists!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListSection;
