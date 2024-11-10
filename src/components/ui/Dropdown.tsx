import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useEffect, useState } from 'react';

interface IDropdownOptions {
  value: string;
  label?: string;
}

export interface IDropdownProps {
  trigger: React.ReactNode;
  options: IDropdownOptions[];
  onSelect: (value: string) => void;
  defaultValue?: string;
}

const DropdownComponent: React.FC<IDropdownProps> = ({
  trigger,
  options,
  onSelect,
  defaultValue,
}) => {
  const [current, setCurrent] = useState(defaultValue);
  // TODO wait for layout
  useEffect(() => {
    setCurrent(defaultValue);
  }, [defaultValue]);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.RadioGroup
            value={current}
            onValueChange={value => {
              setCurrent(value);
              onSelect(value);
            }}
          >
            {options.map((option, index) => (
              <DropdownMenu.RadioItem key={index} value={option.value}>
                <DropdownMenu.ItemIndicator>
                  <>v</>
                </DropdownMenu.ItemIndicator>
                {option.label || option.value}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
export default DropdownComponent;
