import IconClose from '@/components/ui/icons/CloseIcon';
import useEditProfileStore from '@/stores/useEditProfileStore';

import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

interface IEditModeFooterProps {
  // Add any props you need for the page
}

const EditModeFooter: React.FC<IEditModeFooterProps> = () => {
  const submitFooterRef = useRef<HTMLDivElement>(null);
  const { isModified } = useEditProfileStore();

  // FUTURE: custom hook?
  const onSave = () => {};

  const footerPosition = () => {
    if (submitFooterRef.current && window.visualViewport) {
      submitFooterRef.current.style.top = `${window.visualViewport.height - submitFooterRef.current.offsetHeight}px`;
    }
  };

  useEffect(() => {
    footerPosition();
  }, []);

  return (
    <div
      ref={submitFooterRef}
      className="fixed z-10 flex h-14 w-dvw max-w-mobile-max items-center justify-between border-t border-t-gray-main-03 bg-white px-4 py-2"
    >
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onSave()}
          aria-label="Previous"
          className="h-auto rounded-full bg-inherit p-0"
        >
          <IconClose />
        </Button>
        <p className="text-[17px] font-bold">Edit profile and account</p>
      </div>
      <Button
        variant="black"
        shape="rounded8px"
        disabled={!isModified()}
        onClick={onSave}
      >
        <p className="text-[17px] font-bold">Save</p>
      </Button>
    </div>
  );
};

export default EditModeFooter;
