import { Button } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import { cn } from '@/lib/utils';

type ImagePreviewProps = {
  className?: string;
  file: File | null;
  callback: () => void;
};

const ImagePreviewComponent: React.FC<ImagePreviewProps> = ({ file, callback, className }) => {
  if (!file) {
    return null;
  }
  return (
    <div className={cn('relative', className)}>
      <img
        src={URL.createObjectURL(file)}
        alt="Cover Image Preview"
        className="rounded-2xl border border-black-text-01 object-cover w-60 h-60"
      />
      <Button
        onClick={() => callback()}
        aria-label="Reset Cover Image"
        className="p-0 h-auto rounded-full bg-inherit absolute top-4 right-4"
      >
        <IconClose width={32} height={32} />
      </Button>
    </div>
  );
};

export default ImagePreviewComponent;
