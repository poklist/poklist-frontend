import { Dialog, DialogContent } from '@/components/ui/dialog';
import useAutosizeTextArea from '@/hooks/useAutosizedTextArea';
import { IEditFieldConfig } from '@/types/EditField';
import { t } from '@lingui/core/macro';
import { useEffect, useRef, useState } from 'react';
import { useFakePage } from '.';
import EditModeFooter from '../Footer/EditModeFooter';
import ImageCropper from '../ImageCropper';
import { Textarea } from '../ui/textarea';

export const EditFieldFakePageComponent: React.FC<IEditFieldConfig> = ({
  fieldName,
  variant,
  onFieldValueSet,
  edittingFieldValue,
  placeholder = t`Enter your text here`,
  characterLimit,
}) => {
  const { isOpen, closeFakePage } = useFakePage();
  const [fieldValue, setFieldValue] = useState<string>(
    edittingFieldValue ?? ''
  );
  const isModified =
    fieldValue !== undefined && fieldValue !== edittingFieldValue;

  useEffect(() => {
    setFieldValue(edittingFieldValue ?? '');
  }, [edittingFieldValue]);

  return (
    <Dialog open={isOpen} onOpenChange={closeFakePage}>
      <DialogContent className="flex h-screen w-full items-center border-0 bg-transparent p-0">
        <div
          id="edit-field-fake-page"
          className="z-10 flex h-full w-full flex-col items-center bg-white px-6 py-6 md:max-w-mobile-max"
        >
          {variant === 'text' ? (
            <TextInput
              value={fieldValue}
              onChange={setFieldValue}
              placeholderText={placeholder}
              characterLimit={characterLimit}
            />
          ) : (
            <ImageCropper value={fieldValue ?? ''} onChange={setFieldValue} />
          )}
        </div>
        <EditModeFooter
          isModified={isModified}
          onClose={closeFakePage}
          title={fieldName}
          onSaveText={t`Done`}
          onSave={() => {
            onFieldValueSet(fieldValue);
            closeFakePage();
          }}
          value={fieldValue}
        />
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

  useEffect(() => {
    setFieldValue(value);
  }, [value]);

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
      {characterLimit && (
        <p className="self-end text-black-gray-03">
          {fieldValue?.length ?? 0} / {characterLimit}
        </p>
      )}
    </>
  );
};
