import axios from '@/lib/axios';
import { ListPreview } from '@/types/List';
import { GetListPreviewListResponse } from '@/types/response';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ListSectionSkeleton } from './ListSectionSkeleton';

const ListSection: React.FC = () => {
  const { id } = useParams();
  const [listPreviewList, setListPreviewList] = useState<ListPreview[]>([]);

  const getListPreviewList = async (id: string) => {
    axios.get<GetListPreviewListResponse>(`/lists?userID=${id}`).then((res) => {
      setListPreviewList(res.data.lists);
    });
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id !== undefined) {
      getListPreviewList(id).then(() => {
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return <ListSectionSkeleton />;
  }

  return (
    <div role="list-preview">
      {listPreviewList.map((listPreview, index) => {
        const isLastItem = index === listPreviewList.length - 1;
        return (
          <div
            key={listPreview.title}
            className={`flex min-h-[72px] items-center justify-between ${
              isLastItem ? 'border-b-[3px]' : 'border-b'
            } -tracking-1.1% border-black-text-01 p-4`}
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
      <div className="flex flex-col items-center">
        <div
          id="list-data-placeholder"
          className="mt-4 flex flex-col items-center text-[15px] font-semibold text-black-text-01"
        >
          {listPreviewList.length === 0 && (
            <>
              <p>Looks like this pok is a bit empty.</p>
              <p>Follow and check back soon for surprise lists!</p>
            </>
          )}
        </div>
        <div className="bg-user-page-grid bg-1% w-mobile-max absolute h-full bg-[-0.1px] opacity-25" />
      </div>
    </div>
  );
};

export default ListSection;
