import { EditFieldVariant } from '@/enums/EditField/index.enum';

export interface IEditFieldConfig {
  fieldName: string;
  variant: EditFieldVariant;
  placeholder?: string;
  characterLimit?: number;
  onFieldValueSet: (value: string | undefined) => void;
  edittingFieldValue?: string;
  errorMessage?: string;
  validator?: (value?: string) => boolean;
}
