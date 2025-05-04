import { cn } from '@/lib/utils';
import * as SliderPrimitive from '@radix-ui/react-slider';
import React from 'react';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <form>
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex h-5 w-[200px] touch-none select-none items-center',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[3px] grow rounded-full bg-black">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-black" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="shadow-blackA4 hover:bg-violet3 focus:shadow-blackA5 block size-5 rounded-[10px] bg-white shadow-[0_2px_10px] focus:shadow-[0_0_0_5px] focus:outline-none"
        aria-label="Volume"
      />
    </SliderPrimitive.Root>
  </form>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
