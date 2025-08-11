import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownItemType } from '@/enums/Style/index.enum';
import { cn } from '@/lib/utils';

export type DropdownItem =
  | {
      type: DropdownItemType.ITEM;
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
      danger?: boolean;
    }
  | { type: DropdownItemType.SEPARATOR };

type DropdownMenuProps = { trigger: React.ReactNode; items: DropdownItem[] };

const DropdownMenuComponent = ({ trigger, items }: DropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-2xl shadow-[0px_4px_30px_0px_#00000040]"
      >
        {items.map((item, index) => {
          if (item.type === DropdownItemType.SEPARATOR) {
            return (
              <DropdownMenuSeparator
                key={`separator-${index}`}
                className="my-0 h-0.5 border-gray-note-05"
              />
            );
          }
          return (
            <>
              {index !== 0 && (
                <DropdownMenuSeparator
                  key={`separator-${index}`}
                  className="my-0 h-0.5 border-gray-note-05"
                />
              )}
              <DropdownMenuItem
                key={`item-${index}`}
                onClick={() => item.onClick()}
                className={cn(
                  `w-full flex-1 justify-between rounded-none px-3 pb-2.5 pt-3`,
                  item.danger ? 'text-red-warning-01' : ''
                )}
              >
                {item.label}
                {item.icon && (
                  <div className="flex h-6 w-7 cursor-pointer items-center justify-end">
                    {item.icon}
                  </div>
                )}
              </DropdownMenuItem>
            </>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuComponent;
