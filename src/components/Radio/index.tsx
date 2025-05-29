import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RadioType } from '@/enums/Style/index.enum';
import { cn } from '@/lib/utils';
import { Trans } from '@lingui/react/macro';
import React, { Fragment } from 'react';
export interface IChoice {
  value: string;
  label?: string;
  disabled?: boolean;
}
interface IRadioProps {
  choices: IChoice[];
  onChange: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  type?: RadioType;
  className?: string;
}
export const RadioComponent: React.FC<IRadioProps> = ({
  choices,
  onChange,
  defaultValue,
  disabled,
  type,
  className,
  ...props
}) => {
  return (
    <RadioGroup
      disabled={disabled}
      defaultValue={defaultValue}
      onValueChange={(value) => onChange(value)}
      className={cn(
        ``,
        {
          '': type === RadioType.DEFAULT,
          'radio-button': type === RadioType.BUTTON,
        },
        className
      )}
      {...props}
    >
      {choices.map((choice, index) => (
        <Fragment key={`${choice.value}-${index}`}>
          <RadioGroupItem
            value={choice.value}
            id={`${choice.value}-${index}`}
            className={cn({
              '': type === RadioType.DEFAULT,
              hidden: type === RadioType.BUTTON,
            })}
          />
          <Trans>
            <Label
              htmlFor={`${choice.value}-${index}`}
              className={cn({
                '': type === RadioType.DEFAULT,
                'whitespace-nowrap rounded border border-gray-02 px-4 py-2':
                  type === RadioType.BUTTON,
                'border-black-text-01 bg-yellow-bright-01':
                  defaultValue === choice.value,
              })}
            >
              <Trans>{choice.label || choice.value}</Trans>
            </Label>
          </Trans>
        </Fragment>
      ))}
    </RadioGroup>
  );
};
