import ImagePreviewComponent from '@/components/ImagePreview';
import IconPhoto from '@/components/ui/icons/PhotoIcon';
import { cn } from '@/lib/utils';
import React from 'react';

interface IImageUploaderProps {
  file: string | null | undefined;
  callback: () => void;
  className?: string;
  onRemove?: () => void;
}

const ImageUploader: React.FC<IImageUploaderProps> = ({
  file,
  callback,
  className,
  onRemove,
}) => {
  return (
    <div onClick={() => callback()}>
      {file ? (
        <ImagePreviewComponent
          className={cn(className)}
          file={file ?? null}
          onClickClose={() => onRemove?.()}
        />
      ) : (
        <div
          className={cn(
            `flex h-48 w-48 items-center justify-center rounded-2xl border border-black-tint-04`,
            className
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-note-05">
            <IconPhoto className="w-6" />
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageUploader;
