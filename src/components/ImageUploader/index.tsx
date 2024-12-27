import ImagePreviewComponent from '@/components/ImagePreview';
import IconPhoto from '@/components/ui/icons/PhotoIcon';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { t, Trans } from '@lingui/macro';
import React from 'react';

interface IImageUploaderProps {
  file: File | null | undefined;
  callback: (file: File | null) => void;
  className?: string;
}

const ImageUploader: React.FC<IImageUploaderProps> = ({ file, callback, className }) => {
  const { setShowErrorDrawer } = useCommonStore();

  const onUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const imageFile = fileList[0];
      if (imageFile.size <= 2_097_152) {
        callback(imageFile);
      } else {
        setShowErrorDrawer(true, {
          title: t`Cover image error!`,
          content: t`Must be JPG and under 2MB.`,
        });
      }
    }
  };
  return file ? (
    <ImagePreviewComponent className={cn(className)} file={file} callback={() => callback(null)} />
  ) : (
    <div className={cn(`flex gap-2 items-start`, className)}>
      <IconPhoto />
      <label className="text-black-gray-03">
        <div className="w-full h-6">
          <Trans>Upload a cover</Trans>
        </div>
        <Input type="file" accept="image/*" onChange={e => onUploadFile(e)} className="hidden" />({' '}
        <Trans>500x500px, JPG, max 2MB</Trans> )
      </label>
    </div>
  );
};
export default ImageUploader;
