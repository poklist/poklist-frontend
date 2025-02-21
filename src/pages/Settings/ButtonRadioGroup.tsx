import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonStyleConfig,
  ButtonVariant,
} from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface ButtonOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ButtonRadioGroupProps {
  options: ButtonOption[];
  initialValue?: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  selectedButtonConfig?: ButtonStyleConfig;
  unselectedButtonConfig?: ButtonStyleConfig;
  className?: string;
  disabled?: boolean;
}

export const ButtonRadioGroup: React.FC<ButtonRadioGroupProps> = ({
  options,
  initialValue = [],
  onChange,
  multiple = false,
  selectedButtonConfig = {
    variant: ButtonVariant.BRIGHT_GREEN,
    size: ButtonSize.H38,
    shape: ButtonShape.ROUNDED_5PX,
  },
  unselectedButtonConfig = {
    variant: ButtonVariant.WHITE,
    size: ButtonSize.H38,
    shape: ButtonShape.ROUNDED_5PX,
  },
  className,
  disabled = false,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleClick = (optionValue: string) => {
    if (disabled) return;

    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      setValue(newValue);
      onChange(newValue);
    } else {
      setValue([optionValue]);
      onChange([optionValue]);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => handleClick(option.value)}
          disabled={disabled || option.disabled}
          variant={
            value.includes(option.value)
              ? selectedButtonConfig.variant
              : unselectedButtonConfig.variant
          }
          size={
            value.includes(option.value)
              ? selectedButtonConfig.size
              : unselectedButtonConfig.size
          }
          shape={
            value.includes(option.value)
              ? selectedButtonConfig.shape
              : unselectedButtonConfig.shape
          }
          className="w-fit"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};
