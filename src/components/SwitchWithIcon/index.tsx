import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { useState } from 'react';

export interface SwitchWithIconProps extends React.ComponentProps<
  typeof SwitchPrimitives.Root
> {
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
}

const SwitchWithIcon = ({
  className,
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
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-bright-01 data-[state=unchecked]:bg-black-gray-03',
        className
      )}
      {...props}
      onCheckedChange={(value: boolean) => {
        if (!isControlled) setInternalChecked(value);
        props.onCheckedChange?.(value);
      }}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none flex h-5 w-5 items-center justify-center rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-black-text-01 data-[state=unchecked]:bg-[#d9d9d9] data-[state=checked]:text-white [&_svg]:size-1/2'
        )}
      >
        {checked ? checkedIcon : uncheckedIcon}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
};

export default SwitchWithIcon;
