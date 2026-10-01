import { Textarea } from '@/components/ui/textarea';
import useAutoResizeTextarea from '@/hooks/ui/useAutoResizeTextarea';
import { ListFormSchema } from '@/types/common';
import { ReactNode } from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import z from 'zod';

interface AutoResizeFieldProps {
  name: 'title' | 'description';
  control: Control<z.infer<typeof ListFormSchema>>;
  placeholder: string;
  maxLength: number;
  textareaControl: ReturnType<typeof useAutoResizeTextarea>;
  className: string;
  wrapperClassName: string;
  prefix?: ReactNode;
  formatter?: (value: string) => string;
  'data-testid'?: string;
}

const AutoResizeFields = ({
  name,
  control,
  placeholder,
  maxLength,
  textareaControl,
  className,
  wrapperClassName,
  prefix,
  formatter,
  'data-testid': testId,
}: AutoResizeFieldProps) => {
  const value = useWatch({ name, control });
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div className={wrapperClassName}>
            {prefix}
            <Textarea
              placeholder={placeholder}
              data-testid={testId}
              className={className}
              rows={1}
              {...field}
              ref={(el) => {
                field.ref(el);
                textareaControl.ref.current = el;
              }}
              onBlur={() => {
                field.onBlur();
                textareaControl.bind.onBlur();
              }}
              onFocus={() => textareaControl.bind.onFocus()}
              onChange={(event) => {
                textareaControl.bind.onChange();
                field.onChange(
                  formatter ? formatter(event.target.value) : event.target.value
                );
              }}
            />
            {textareaControl.isFocus && (
              <div className="absolute bottom-4 right-3 text-sm font-normal text-black-tint-04">
                {value?.length ?? 0}/{maxLength}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default AutoResizeFields;
