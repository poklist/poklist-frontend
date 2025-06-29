import { DeleteButton } from '@/app/idea/_components/DeleteButton';
import React from 'react';

interface IHeaderProps {
  title: React.ReactNode;
  deleteCallback?: () => void; // Add the delete callback function to the header props to use in the DeleteButton component.
}
const Header: React.FC<IHeaderProps> = ({ title, deleteCallback }) => {
  return (
    <header className="flex h-12 items-center border-b border-b-black-text-01 bg-gray-main-03 px-4 py-2 text-[15px] text-t1 font-semibold">
      <div className="flex-1">{title}</div>
      {deleteCallback && <DeleteButton deleteCallback={deleteCallback} />}
    </header>
  );
};

export default Header;
