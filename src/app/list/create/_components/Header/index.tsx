import IconLeftArrow from '@/components/ui/icons/LeftArrowIcon';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateAdapter';
import { DeleteButton } from '../../../_components/DeleteButton';
import React from 'react';

interface IHeaderProps {
  title: React.ReactNode;
  deleteCallback?: () => void; // Add the delete callback function to the header props to use in the DeleteButton component.
  backwardCallback?: () => void;
}
const Header: React.FC<IHeaderProps> = ({
  title,
  deleteCallback,
  backwardCallback,
}) => {
  const navigateTo = useStrictNavigationAdapter();
  return (
    <>
      <header
        id="list-header"
        className="sticky top-0 z-10 flex h-[49px] w-full items-center justify-center border-b border-b-black-text-01 bg-white px-4 py-2 text-center text-t1 font-semibold"
      >
        {backwardCallback && (
          <div
            className="absolute left-4 flex h-5 w-5 items-center justify-center"
            onClick={() => navigateTo.backward()}
          >
            <IconLeftArrow height={10} />
          </div>
        )}
        <div className="text-center">{title}</div>
        {deleteCallback && (
          <div className="absolute right-4">
            <DeleteButton deleteCallback={deleteCallback} />
          </div>
        )}
      </header>
      {/* <div id="fixed-header-supporter" className="mt-12 h-[1px]"></div> */}
    </>
  );
};

export default Header;
