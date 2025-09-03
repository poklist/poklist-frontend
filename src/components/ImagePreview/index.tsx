import { Button } from '@/components/ui/button';
import IconCloseThin from '@/components/ui/icons/CloseThinIcon';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type ImagePreviewProps = {
  className?: string;
  file?: File | string | null;
  onClickClose?: () => void;
};

const ImagePreviewComponent: React.FC<ImagePreviewProps> = ({
  file,
  onClickClose,
  className,
}: ImagePreviewProps) => {
  if (!file) {
    return null;
  }
  return (
    <div className={cn('relative', className)}>
      <Image
        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
        width={192}
        height={192}
        alt="Cover Image Preview"
        className="rounded-2xl border border-black-tint-04 object-cover"
      />
      {onClickClose && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickClose();
          }}
          aria-label="Reset Cover Image"
          className="absolute right-3 top-3 h-auto rounded-full border-0 bg-inherit bg-white p-0 opacity-70"
        >
          <IconCloseThin width={26} height={26} />
        </Button>
      )}
    </div>
  );
};

export default ImagePreviewComponent;
