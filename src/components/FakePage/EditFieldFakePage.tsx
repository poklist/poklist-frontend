import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EditFieldVariant } from '@/enums/EditField/index.enum';
import { useState } from 'react';
import { useFakePage } from '.';
import EditModeFooter from '../Footer/EditModeFooter';
import ImageCropper from '../ImageCropper';
import { Input } from '../ui/input';

interface IEditFieldFakePageProps {
  title: string;
  variant: EditFieldVariant;
  onFieldValueSet: (value?: string) => void;

  originalFieldValue?: string;
  placeholder?: string;
  characterLimit?: number;
  errorMessage?: string;
  validator?: (value?: string) => boolean;
}

export const EditFieldFakePageComponent: React.FC<IEditFieldFakePageProps> = ({
  title,
  variant,
  onFieldValueSet,
  originalFieldValue,
  placeholder = 'Enter your text here',
  characterLimit,
}) => {
  const { isOpen, closeFakePage } = useFakePage();
  const [fieldValue, setFieldValue] = useState<string | undefined>(undefined);
  const isModified =
    fieldValue !== undefined && fieldValue !== originalFieldValue;
  const placeholderText =
    originalFieldValue !== undefined ? originalFieldValue : placeholder;

  return (
    <Dialog open={isOpen} onOpenChange={closeFakePage}>
      <DialogContent className="flex h-screen w-full items-center border-0 bg-transparent p-0">
        <div
          id="edit-field-fake-page"
          className="z-10 flex h-full w-full max-w-mobile-max flex-col items-center bg-white px-6 py-6"
        >
          {variant === 'text' ? (
            <TextInput
              value={fieldValue ?? ''}
              onChange={setFieldValue}
              placeholderText={placeholder}
              characterLimit={characterLimit}
            />
          ) : (
            <ImageCropper value={fieldValue ?? ''} onChange={setFieldValue} />
          )}
          <EditModeFooter
            isModified={isModified}
            onClose={closeFakePage}
            title={title}
            onSaveText="Done"
            onSave={() => {
              onFieldValueSet(fieldValue);
              setFieldValue(undefined);
              closeFakePage();
            }}
            value={fieldValue}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ITextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholderText: string;
  characterLimit?: number;
}

const TextInput: React.FC<ITextInputProps> = ({
  value,
  onChange,
  placeholderText,
  characterLimit,
}) => {
  const [fieldValue, setFieldValue] = useState<string | undefined>(value);
  return (
    <>
      <Input
        value={fieldValue}
        onChange={(e) => {
          setFieldValue(e.target.value);
          onChange(e.target.value);
        }}
        className="w-full border-0"
        placeholder={placeholderText}
      />
      <>
        {characterLimit && (
          <p>
            {fieldValue?.length ?? 0} / {characterLimit}
          </p>
        )}
      </>
    </>
  );
};
