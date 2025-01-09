import { IListInfo } from '@/hooks/Lists/useGetList';
import React from 'react';

interface IListInfoSectionProps {
  listInfo: IListInfo | undefined;
}
const ListInfoSection: React.FC<IListInfoSectionProps> = ({ listInfo }) => {
  return (
    <div className="flex flex-col justify-center gap-6 my-6">
      <div className="font-extrabold text-h1 text-center line-clamp-3">{listInfo?.title}</div>
      <div className="text-t1 line-clamp-1 text-center font-normal">{listInfo?.description}</div>
    </div>
  );
};

export default ListInfoSection;
