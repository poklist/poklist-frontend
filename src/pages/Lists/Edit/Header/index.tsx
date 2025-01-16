import { DeleteButton } from '@/pages/Lists/Edit/DeleteButton';
import React from 'react';

interface IHeaderProps {
  title: React.ReactNode;
  deleteCallback?: () => void; // Add the delete callback function to the header props to use in the DeleteButton component.
}
export const Header: React.FC<IHeaderProps> = ({ title, deleteCallback }) => {
  return (
    <header className="border-b border-b-black-text-01 font-semibold text-t1 px-4 py-2 text-center flex items-center">
      <div className="flex-1 text-center">{title}</div>
      {deleteCallback && <DeleteButton deleteCallback={deleteCallback} />}
    </header>
  );
};
