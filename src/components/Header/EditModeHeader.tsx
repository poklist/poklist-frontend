import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconLeftArrowThin from '@/components/ui/icons/LeftArrowThinIcon';
import { t } from '@lingui/core/macro';
interface EditModeHeaderProps {
  onClose: () => void;
  title: string;
  onSave: (value?: string) => void;
  saveButtonText?: string;
  value?: string;
  disabled?: boolean;
}

const EditModeHeader: React.FC<EditModeHeaderProps> = ({
  onClose,
  title,
  onSave,
  saveButtonText = t`Save`,
  value,
  disabled = true,
}: EditModeHeaderProps) => {
  return (
    <div
      id="edit-mode-header"
      aria-label="Edit mode header"
      className="fixed top-0 z-10 flex h-14 w-full justify-between border-b border-b-note-gray-06 bg-white px-4 py-2 sm:sticky"
    >
      <div className="flex items-center gap-1">
        <div
          onClick={onClose}
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center"
        >
          <IconLeftArrowThin width={7.5} height={15} color="black" />
        </div>
        <p className="text-base font-bold">{title}</p>
      </div>
      <Button
        variant={ButtonVariant.BLACK}
        shape={ButtonShape.ROUNDED_5PX}
        disabled={disabled}
        onClick={() => onSave(value)}
      >
        <p className="text-base font-bold">{saveButtonText}</p>
      </Button>
    </div>
  );
};

export default EditModeHeader;
