import IconAddCircle from '@/components/ui/icons/AddCircleIcon';
import { Trans } from '@lingui/macro';

interface AddIdeaRowProps {
  onClick: () => void;
}

export const AddIdeaRow: React.FC<AddIdeaRowProps> = ({
  onClick,
}: AddIdeaRowProps) => (
  <div className="mt-4 w-full">
    <div
      onClick={onClick}
      className="flex min-h-[65px] items-center gap-2.5 border-b border-t border-gray-main-03 p-4 text-[15px] font-semibold -tracking-1.1% text-black-text-01"
    >
      <IconAddCircle
        width={18}
        height={18}
        className="rounded-full bg-yellow-bright-01"
      />
      <Trans>Add an idea</Trans>
    </div>
  </div>
);
