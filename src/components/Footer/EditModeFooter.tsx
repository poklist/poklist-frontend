import IconClose from '@/components/ui/icons/CloseIcon';

import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

interface IEditModeFooterProps {
  onClose: () => void;
  title: string;
  onSave: ((value?: string) => void) | (() => void);
  onSaveText?: string;
  value?: string;
  isModified: boolean;
}

const EditModeFooter: React.FC<IEditModeFooterProps> = ({
  onClose,
  title,
  onSave,
  onSaveText = 'Save', // TODO: i18n
  value,
  isModified,
}) => {
  const submitFooterRef = useRef<HTMLDivElement>(null);

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
          onClick={onClose}
          aria-label="Previous"
          className="h-auto rounded-full bg-inherit p-0"
        >
          <IconClose />
        </Button>
        <p className="text-[17px] font-bold">{title}</p>
      </div>
      <Button
        variant={ButtonVariant.BLACK}
        shape={ButtonShape.ROUNDED_5PX}
        disabled={!isModified}
        onClick={value ? () => onSave(value) : () => onSave()}
      >
        <p className="text-[17px] font-bold">{onSaveText} </p>
      </Button>
    </div>
  );
};

export default EditModeFooter;
