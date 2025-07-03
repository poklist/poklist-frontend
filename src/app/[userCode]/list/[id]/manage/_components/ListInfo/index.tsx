import { List } from '@/types/List';
import React from 'react';

interface IListInfoSectionProps {
  listInfo: List | undefined;
}
const ListInfoSection: React.FC<IListInfoSectionProps> = ({ listInfo }) => {
  return (
    <div className="my-6 flex flex-col justify-center gap-6 px-4">
      <div className="line-clamp-3 text-center text-h1 font-extrabold">
        {listInfo?.title}
      </div>
      <div className="line-clamp-1 text-center text-t1 font-normal">
        {listInfo?.description}
      </div>
    </div>
  );
};

export default ListInfoSection;
