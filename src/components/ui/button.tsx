import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        highlighted:
          'border border-black bg-yellow-bright-01 text-black-text-01 disabled:opacity-50',
        warning:
          'border border-red-warning-01 text-red-warning-01 disabled:opacity-50',
        black:
          'bg-black text-white disabled:bg-gray-main-03 disabled:text-black-tint-04',
        white:
          'border border-black bg-white text-black-text-01 disabled:opacity-50',
        gray: ' bg-gray-main-03 text-black-text-01 disabled:opacity-50',
        subActive:
          'border border-gray-main-03 bg-gray-note-05 text-black-text-01 disabled:opacity-50',
      },
      size: {
        // sm: 'px-3',
        md: 'h-8 text-[13px] px-3',
        lg: 'h-12 text-[15px] px-8',
        icon: 'h-8 w-8',
      },
      shape: {
        roundedFull: 'rounded-full',
        rounded8px: 'rounded-[8px]',
      },
    },
    defaultVariants: {
      variant: 'white',
      size: 'md',
      shape: 'roundedFull',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
