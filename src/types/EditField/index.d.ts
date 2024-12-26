import { EditFieldVariant } from '@/enums/EditField/index.enum';

export interface IEditFieldConfig {
  fieldName: string;
  variant: EditFieldVariant;
  placeholder?: string;
  onFieldValueSet: (value: string | undefined) => void;
}
