import ImagePreviewComponent from '@/components/ImagePreview';
import IconPhoto from '@/components/ui/icons/PhotoIcon';
import { cn } from '@/lib/utils';
import { Trans } from '@lingui/react/macro';
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
        <div className={cn(`flex items-start gap-2`, className)}>
          <IconPhoto />
          <label className="text-black-gray-03">
            <div className="h-6 w-full">
              <Trans>Upload a cover</Trans>
            </div>
            <Trans>500x500px, JPG or PNG, max 4MB</Trans>
          </label>
        </div>
      )}
    </div>
  );
};
export default ImageUploader;
