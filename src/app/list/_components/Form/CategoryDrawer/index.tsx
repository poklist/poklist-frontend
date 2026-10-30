import { DrawerComponent } from '@/components/Drawer';
import { IChoice, RadioComponent } from '@/components/Radio';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import { DrawerIds } from '@/constants/Drawer';
import { RadioType } from '@/enums/Style/index.enum';
import { ListFormSchema } from '@/types/common';
import { Trans } from '@lingui/macro';
import { Control, Controller } from 'react-hook-form';
import z from 'zod';

interface CategoryDrawerProps {
  isCategoryLoading: boolean;
  categories: IChoice[];
  control: Control<z.infer<typeof ListFormSchema>>;
  onCategoryChange: (value: string) => void;
  isCreate: boolean;
  disabledNext: boolean;
  onNext: () => void;
  onDone: () => void;
}

const CategoryDrawer = ({
  isCategoryLoading,
  categories,
  control,
  onCategoryChange,
  isCreate,
  disabledNext,
  onNext,
  onDone,
}: CategoryDrawerProps) => (
  <DrawerComponent
    drawerId={DrawerIds.CATEGORY_DRAWER_ID}
    isShowClose={false}
    header={<Trans>名單主題</Trans>}
    subHeader={<Trans>選擇一項接近此份名單的分類</Trans>}
    content={
      !isCategoryLoading && (
        <div className="mb-10 mt-6">
          <Controller
            name="categoryID"
            control={control}
            render={({ field }) => (
              <RadioComponent
                defaultValue={String(field.value)}
                choices={categories}
                onChange={onCategoryChange}
                type={RadioType.BUTTON}
                className="flex flex-wrap gap-2"
              />
            )}
          />
        </div>
      )
    }
    endFooter={
      isCreate ? (
        <Button
          disabled={disabledNext}
          onClick={onNext}
          type="submit"
          variant={ButtonVariant.BLACK}
          shape={ButtonShape.ROUNDED_5PX}
          data-testid="category-submit"
        >
          <Trans>下一步</Trans>
        </Button>
      ) : (
        <Button
          onClick={onDone}
          variant={ButtonVariant.BLACK}
          shape={ButtonShape.ROUNDED_5PX}
          data-testid="category-submit"
        >
          <Trans>完成</Trans>
        </Button>
      )
    }
  />
);
export default CategoryDrawer;
