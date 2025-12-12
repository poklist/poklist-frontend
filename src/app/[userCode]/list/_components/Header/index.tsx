import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconLeftArrowThin from '@/components/ui/icons/LeftArrowThinIcon';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { Trans } from '@lingui/macro';
import React from 'react';

interface IHeaderProps {
  title: React.ReactNode;
  rightButtonCallback?: () => void; // Add the delete callback function to the header props to use in the DeleteButton component.
}
const Header: React.FC<IHeaderProps> = ({ title, rightButtonCallback }) => {
  const navigateTo = useStrictNavigationAdapter();
  return (
    <header
      id="list-header"
      className="sticky top-0 z-10 flex h-14 w-full justify-between overflow-hidden border-b border-b-gray-note-05 bg-white px-4 py-2"
    >
      <div className="flex items-center gap-1 font-bold">
        <div
          onClick={() => navigateTo.backward()}
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center"
        >
          <IconLeftArrowThin width={7.5} height={15} color="black" />
        </div>
        {title}
      </div>
      <Button
        disabled={!rightButtonCallback}
        onClick={() => {
          if (rightButtonCallback) {
            rightButtonCallback();
          }
        }}
        variant={ButtonVariant.BLACK}
        shape={ButtonShape.ROUNDED_5PX}
      >
        <Trans>Done</Trans>
      </Button>
    </header>
  );
};

export default Header;
