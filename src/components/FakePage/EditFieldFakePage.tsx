import { Dialog, DialogContent } from '@/components/ui/dialog';
import useAutosizeTextArea from '@/hooks/useAutosizedTextArea';
import { IEditFieldConfig } from '@/types/EditField';
import { useRef, useState } from 'react';
import { useFakePage } from '.';
import EditModeFooter from '../Footer/EditModeFooter';
import ImageCropper from '../ImageCropper';
import { Textarea } from '../ui/textarea';

interface IEditFieldFakePageProps extends IEditFieldConfig {
  originalFieldValue?: string;
  errorMessage?: string;
  validator?: (value?: string) => boolean;
}

export const EditFieldFakePageComponent: React.FC<IEditFieldFakePageProps> = ({
  fieldName,
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
            title={fieldName}
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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, value);

  return (
    <>
      <Textarea
        ref={textAreaRef}
        value={fieldValue}
        maxLength={characterLimit}
        onChange={(e) => {
          setFieldValue(e.target.value);
          onChange(e.target.value);
        }}
        className="w-full border-0"
        placeholder={placeholderText}
      />
      <>
        {characterLimit && (
          <p className="self-end text-black-gray-03">
            {fieldValue?.length ?? 0} / {characterLimit}
          </p>
        )}
      </>
    </>
  );
};
