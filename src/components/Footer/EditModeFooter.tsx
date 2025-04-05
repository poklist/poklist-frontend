import IconClose from '@/components/ui/icons/CloseIcon';

import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import { t } from '@lingui/core/macro';

interface IEditModeFooterProps {
  onClose: () => void;
  title: string;
  onSave: (value?: string) => void;
  onSaveText?: string;
  value?: string;
  disabled?: boolean;
}

const EditModeFooter: React.FC<IEditModeFooterProps> = ({
  onClose,
  title,
  onSave,
  onSaveText = t`Save`,
  value,
  disabled = true,
}) => {
  return (
    <footer
      id="edit-mode-footer"
      className="fixed bottom-0 z-10 flex h-14 w-full items-center justify-between border-t border-t-gray-main-03 bg-white px-4 py-2 sm:sticky"
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
        disabled={disabled}
        onClick={() => onSave(value)}
      >
        <p className="text-[17px] font-bold">{onSaveText} </p>
      </Button>
    </footer>
  );
};

export default EditModeFooter;
