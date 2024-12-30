import IconTrash from '@/components/ui/icons/TrashIcon';
import React from 'react';

interface IHeaderProps {
  title: React.ReactNode;
}
export const Header: React.FC<IHeaderProps> = ({ title }) => {
  return (
    <header className="border-b border-b-black-text-01 font-semibold text-t1 px-4 py-2 text-center flex items-center">
      <div className="flex-1 text-center">{title}</div>
      <IconTrash className="cursor-pointer" />
    </header>
  );
};
