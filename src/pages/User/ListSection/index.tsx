import axios from '@/lib/axios';
import { ListPreview } from '@/types/List';
import { IResponse } from '@/types/response';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TileBackground } from '../TileBackground';
import { ListSectionSkeleton } from './ListSectionSkeleton';

const ListSection: React.FC = () => {
  const { code } = useParams();
  const [listPreviewList, setListPreviewList] = useState<ListPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getListPreviewList = async (code: string) => {
    if (!code) return;
    // FUTURE: maybe set pagination in the future
    const res = await axios.get<IResponse<ListPreview[]>>(`/${code}/lists`);
    // TODO: error handling
    setListPreviewList(res.data.content ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    if (code !== undefined) {
      getListPreviewList(code);
    }
  }, [code]);

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
            } border-black-text-01 p-4 -tracking-1.1%`}
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
        {listPreviewList.length === 0 && (
          <div
            id="list-data-placeholder"
            className="mt-4 flex flex-col items-center text-[15px] font-semibold text-black-text-01"
          >
            <p>Looks like this pok is a bit empty.</p>
            <p>Follow and check back soon for surprise lists!</p>
          </div>
        )}
        <TileBackground />
      </div>
    </div>
  );
};

export default ListSection;
