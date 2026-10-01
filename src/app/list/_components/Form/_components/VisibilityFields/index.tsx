import SwitchWithIcons from '@/components/SwitchWithIcon';
import IconPrivateEye from '@/components/ui/icons/PrivateEyeIcon';
import IconPublicEye from '@/components/ui/icons/PublicEyeIcon';
import { ListType } from '@/enums/Lists/index.enum';
import { ListFormSchema } from '@/types/common';
import { Trans } from '@lingui/macro';
import { Control, Controller } from 'react-hook-form';
import z from 'zod';

interface VisibilityFieldProps {
  control: Control<z.infer<typeof ListFormSchema>>;
  onChange: (checked: boolean) => void;
}

const VisibilityFields: React.FC<VisibilityFieldProps> = ({
  control,
  onChange,
}: VisibilityFieldProps) => {
  return (
    <div className="relative mt-2 h-44 border-y border-y-gray-note-05 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-t1 font-semibold text-black-text-01">
          <Trans>隱藏這份名單</Trans>
          <div className="text-t2 text-black-gray-03">
            <Trans>只有你能看見這份名單</Trans>
          </div>
        </div>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <SwitchWithIcons
              checked={field.value === ListType.PRIVATE}
              data-testid="list-visibility-switch"
              onCheckedChange={onChange}
              checkedIcon={<IconPrivateEye />}
              uncheckedIcon={<IconPublicEye />}
            />
          )}
        />
      </div>
    </div>
  );
};

export default VisibilityFields;
