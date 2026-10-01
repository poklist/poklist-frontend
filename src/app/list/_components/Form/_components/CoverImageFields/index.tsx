import ImageUploader from '@/components/ImageUploader';
import { ListFormSchema } from '@/types/common';
import { Control, Controller } from 'react-hook-form';
import z from 'zod';

interface CoverImageFieldProps {
  control: Control<z.infer<typeof ListFormSchema>>;
  onOpenImage: () => void;
  onRemove: () => void;
}

const CoverImageFields = ({
  control,
  onOpenImage,
  onRemove,
}: CoverImageFieldProps) => (
  <div className="flex items-center justify-center">
    <Controller
      name="coverImage"
      control={control}
      render={({ field }) => (
        <ImageUploader
          file={field.value}
          callback={onOpenImage}
          onRemove={onRemove}
        />
      )}
    />
  </div>
);

export default CoverImageFields;
