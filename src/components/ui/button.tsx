import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface ButtonStyleConfig {
  variant: ButtonVariant;
  size: ButtonSize;
  shape: ButtonShape;
}

export enum ButtonVariant {
  HIGHLIGHTED = 'highlighted',
  WARNING = 'warning',
  BLACK = 'black',
  WHITE = 'white',
  GRAY = 'gray',
  SUB_ACTIVE = 'subActive',
  BRIGHT_GREEN = 'brightGreen',
}

export enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  H38 = 'h38',
  H40 = 'h40',
  LG = 'lg',
  ICON = 'icon',
}

export enum ButtonShape {
  ROUNDED_FULL = 'roundedFull',
  ROUNDED_8PX = 'rounded8px',
  ROUNDED_5PX = 'rounded5px',
}

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        [ButtonVariant.HIGHLIGHTED]:
          'border border-black bg-yellow-bright-01 text-black-text-01 disabled:opacity-50',
        [ButtonVariant.WARNING]:
          'border border-red-warning-01 text-red-warning-01 disabled:opacity-50',
        [ButtonVariant.BLACK]:
          'bg-black text-white disabled:bg-gray-main-03 disabled:text-black-tint-04',
        [ButtonVariant.WHITE]:
          'border border-black bg-white text-black-text-01 disabled:opacity-50',
        [ButtonVariant.GRAY]:
          ' bg-gray-main-03 text-black-text-01 disabled:opacity-50',
        [ButtonVariant.SUB_ACTIVE]:
          'border border-gray-main-03 bg-gray-note-05 text-black-text-01 disabled:opacity-50',
        [ButtonVariant.BRIGHT_GREEN]:
          'border border-black bg-green-bright-01 text-black-text-01 disabled:opacity-50',
      },
      size: {
        [ButtonSize.SM]: 'h-8 text-[13px] px-3',
        [ButtonSize.MD]: 'h-10 text-[15px] px-3',
        [ButtonSize.H38]: 'h-[38px] text-[15px] px-3',
        [ButtonSize.H40]: 'h-10 text-[15px] w-full',
        [ButtonSize.LG]: 'h-12 text-[15px] px-8',
        [ButtonSize.ICON]: 'h-8 w-8',
      },
      shape: {
        [ButtonShape.ROUNDED_FULL]: 'rounded-full',
        [ButtonShape.ROUNDED_8PX]: 'rounded-lg',
        [ButtonShape.ROUNDED_5PX]: 'rounded-[5px]',
      },
    },
    defaultVariants: {
      variant: ButtonVariant.WHITE,
      size: ButtonSize.MD,
      shape: ButtonShape.ROUNDED_FULL,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, shape, asChild = false, ...props }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
