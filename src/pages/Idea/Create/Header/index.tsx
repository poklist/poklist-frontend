import React from 'react';

interface IHeaderProps {
  title: React.ReactNode;
}
export const Header: React.FC<IHeaderProps> = ({ title }) => {
  return (
    <header className="border-b border-b-black-text-01 font-semibold text-t1 px-4 py-3 text-center">
      {title}
    </header>
  );
};
