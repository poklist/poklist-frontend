import ImagePreviewComponent from '@/components/ImagePreview';
import IconPhoto from '@/components/ui/icons/PhotoIcon';
import { Input } from '@/components/ui/input';
import useCommonStore from '@/stores/useCommonStore';
import { t, Trans } from '@lingui/macro';
import React from 'react';

interface IImageUploaderProps {
  file: File | null;
  callback: (file: File | null) => void;
}

const ImageUploader: React.FC<IImageUploaderProps> = ({ file, callback }) => {
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
    <ImagePreviewComponent file={file} callback={() => callback(null)} />
  ) : (
    <div className="flex items-start gap-2">
      <IconPhoto />
      <label className="text-black-gray-03">
        <div className="h-6 w-full">
          <Trans>上傳封面</Trans>
        </div>
        <div className="h-6 w-full">
          <Trans>Upload a cover</Trans>
        </div>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => onUploadFile(e)}
          className="hidden"
        />
        ( <Trans>500x500 像素，限 JPG，最大 2MB</Trans> )
      </label>
    </div>
  );
};
export default ImageUploader;
