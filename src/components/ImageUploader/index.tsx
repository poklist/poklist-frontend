import ImagePreviewComponent from '@/components/ImagePreview';
import IconPhoto from '@/components/ui/icons/PhotoIcon';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import React from 'react';

interface IImageUploaderProps {
  file: File | null | undefined;
  callback: (file: File | null) => void;
  className?: string;
}

const ImageUploader: React.FC<IImageUploaderProps> = ({
  file,
  callback,
  className,
}) => {
  const { setShowErrorDrawer } = useCommonStore();

  const onUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const imageFile = fileList[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        if (img.width !== img.height) {
          setShowErrorDrawer(true, {
            title: t`Cover image error!`,
            content: t`Must be square.`,
          });
          return;
        }
      };
      reader.readAsDataURL(imageFile);

      if (
        imageFile.size > 4_194_304 ||
        (imageFile.type !== 'image/jpeg' && imageFile.type !== 'image/png')
      ) {
        setShowErrorDrawer(true, {
          title: t`Cover image error!`,
          content: t`Must be JPG or PNG and under 4MB.`,
        });
        return;
      }
      callback(imageFile);
    }
  };
  return file ? (
    <ImagePreviewComponent
      className={cn(className)}
      file={file}
      callback={() => callback(null)}
    />
  ) : (
    <div className={cn(`flex items-start gap-2`, className)}>
      <IconPhoto />
      <label className="text-black-gray-03">
        <div className="h-6 w-full">
          <Trans>Upload a cover</Trans>
        </div>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => onUploadFile(e)}
          className="hidden"
        />
        ( <Trans>500x500px, JPG or PNG, max 4MB</Trans> )
      </label>
    </div>
  );
};
export default ImageUploader;
