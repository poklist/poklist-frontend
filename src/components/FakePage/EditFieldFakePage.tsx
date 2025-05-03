import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EditFieldVariant } from '@/enums/EditField/index.enum';
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
  allowEmpty = true,
  cropShape = 'rect',
  validator,
  trimmer,
}) => {
  const { isOpen, closeFakePage } = useFakePage();
  const [fieldValue, setFieldValue] = useState<string>(
    edittingFieldValue ?? ''
  );
  const isSaveDisabled =
    variant === EditFieldVariant.TEXT &&
    ((!allowEmpty && !fieldValue) || fieldValue === edittingFieldValue);

  useEffect(() => {
    if (variant === EditFieldVariant.TEXT) {
      setFieldValue(edittingFieldValue ?? '');
    }
  }, [edittingFieldValue]);

  return (
    <Dialog open={isOpen} onOpenChange={closeFakePage}>
      <DialogContent className="flex h-[100dvh] w-full items-center border-0 bg-transparent p-0">
        <div
          id="edit-field-fake-page"
          className="z-10 flex h-full w-full flex-col items-center bg-white px-6 pb-6 pt-10 sm:pt-6 md:max-w-mobile-max"
        >
          {variant === 'text' ? (
            <TextInput
              value={fieldValue}
              onChange={setFieldValue}
              placeholderText={placeholder}
              characterLimit={characterLimit}
              validator={validator}
              trimmer={trimmer}
            />
          ) : (
            <ImageCropper
              value={fieldValue ?? ''}
              onChange={setFieldValue}
              cropShape={cropShape}
            />
          )}
        </div>
        <EditModeFooter
          disabled={isSaveDisabled}
          onClose={() => closeFakePage()}
          title={fieldName}
          onSaveText={t`Done`}
          onSave={() => {
            if (validator === undefined || validator(fieldValue)) {
              onFieldValueSet(fieldValue);
              closeFakePage();
            }
            return;
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
  validator?: (value: string) => boolean;
  trimmer?: (value: string) => string;
}

const TextInput: React.FC<ITextInputProps> = ({
  value,
  onChange,
  placeholderText,
  characterLimit,
  validator,
  trimmer,
}) => {
  const [fieldValue, setFieldValue] = useState<string | undefined>(value);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef, value);

  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setFieldValue(newValue);
    onChange(newValue);
  };

  return (
    <>
      <Textarea
        ref={textAreaRef}
        value={fieldValue}
        maxLength={characterLimit}
        onChange={handleInput}
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
