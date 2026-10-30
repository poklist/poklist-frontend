import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { useState } from 'react';

export enum SwitchVariant {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum SwitchSize {
  SM = 'sm',
  MD = 'md',
}

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-smart-purple',
  {
    variants: {
      variant: {
        [SwitchVariant.DARK]: 'data-[state=unchecked]:bg-black-gray-03',
        [SwitchVariant.LIGHT]: 'data-[state=unchecked]:bg-gray-primary-07',
      },
      size: {
        [SwitchSize.SM]: 'h-5 w-9',
        [SwitchSize.MD]: 'h-6 w-11',
      },
    },
    defaultVariants: {
      variant: SwitchVariant.DARK,
      size: SwitchSize.MD,
    },
  }
);

const switchThumbVariants = cva(
  'pointer-events-none flex items-center justify-center rounded-full shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 [&_svg]:size-1/2',
  {
    variants: {
      variant: {
        [SwitchVariant.DARK]:
          'data-[state=checked]:bg-black-text-01 data-[state=unchecked]:bg-[#d9d9d9] data-[state=checked]:text-white',
        [SwitchVariant.LIGHT]: 'bg-white',
      },
      size: {
        [SwitchSize.SM]: 'h-4 w-4 data-[state=checked]:translate-x-4',
        [SwitchSize.MD]: 'h-5 w-5 data-[state=checked]:translate-x-5',
      },
    },
    defaultVariants: {
      variant: SwitchVariant.DARK,
      size: SwitchSize.MD,
    },
  }
);

export interface SwitchWithIconProps
  extends
    React.ComponentProps<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
}

const SwitchWithIcon = ({
  className,
  variant,
  size,
  checkedIcon,
  uncheckedIcon,
  ...props
}: SwitchWithIconProps) => {
  const isControlled = props.checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(
    props.defaultChecked ?? false
  );
  const checked = isControlled ? props.checked : internalChecked;

  return (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ variant, size }), className)}
      {...props}
      onCheckedChange={(value: boolean) => {
        if (!isControlled) setInternalChecked(value);
        props.onCheckedChange?.(value);
      }}
    >
      <SwitchPrimitives.Thumb
        className={switchThumbVariants({ variant, size })}
      >
        {checked ? checkedIcon : uncheckedIcon}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
};

export { switchVariants };
export default SwitchWithIcon;
