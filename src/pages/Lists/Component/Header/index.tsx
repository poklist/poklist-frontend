import { DeleteButton } from '@/pages/Lists/Component/DeleteButton';
import React from 'react';

interface IHeaderProps {
  title: React.ReactNode;
  deleteCallback?: () => void; // Add the delete callback function to the header props to use in the DeleteButton component.
}
export const Header: React.FC<IHeaderProps> = ({ title, deleteCallback }) => {
  return (
    <header className="flex items-center border-b border-b-black-text-01 px-4 py-2 text-center text-t1 font-semibold">
      <div className="flex-1 text-center">{title}</div>
      {deleteCallback && <DeleteButton deleteCallback={deleteCallback} />}
    </header>
  );
};
