import { Trans } from '@lingui/react';
import { X } from 'lucide-react';
import { ERROR_DIALOG } from '@/constants/Home/index.en';

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const ErrorDialog = ({
  open,
  onOpenChange,
  onClose,
}: ErrorDialogProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-[90%] max-w-mobile-max space-y-2 bg-white px-4 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end py-1">
          <button
            onClick={() => onOpenChange(false)}
            className="flex size-[26px] items-center justify-center justify-items-end rounded-full bg-black text-white"
            aria-label="關閉"
          >
            <X className="size-3 font-bold" />
          </button>
        </div>
        <h2 className="text-h2 font-bold text-black-text-01">
          <Trans
            id={ERROR_DIALOG.title.id}
            message={ERROR_DIALOG.title.message}
          />
        </h2>
        <p className="text-t1 text-black">
          <Trans
            id={ERROR_DIALOG.description.id}
            message={ERROR_DIALOG.description.message}
          />
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => {
              onOpenChange(false);
              onClose();
            }}
            className="w-fit rounded-lg border border-black bg-black px-3 py-2 text-h2 font-bold text-white"
          >
            <Trans
              id={ERROR_DIALOG.buttonText.id}
              message={ERROR_DIALOG.buttonText.message}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
