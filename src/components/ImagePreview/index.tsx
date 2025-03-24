import { Button } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import { cn } from '@/lib/utils';

type ImagePreviewProps = {
  className?: string;
  file: File | null;
  callback: () => void;
};

const ImagePreviewComponent: React.FC<ImagePreviewProps> = ({
  file,
  callback,
  className,
}) => {
  if (!file) {
    return null;
  }
  return (
    <div className={cn('relative', className)}>
      <img
        src={URL.createObjectURL(file)}
        alt="Cover Image Preview"
        className="h-60 w-60 rounded-2xl border border-black-text-01 object-cover"
      />
      <Button
        onClick={() => callback()}
        aria-label="Reset Cover Image"
        className="absolute right-4 top-4 h-auto rounded-full bg-inherit p-0"
      >
        <IconClose width={32} height={32} />
      </Button>
    </div>
  );
};

export default ImagePreviewComponent;
