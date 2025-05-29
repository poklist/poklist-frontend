import { EditFieldVariant } from '@/enums/EditField/index.enum';

export interface IEditFieldConfig {
  fieldName: string;
  variant: EditFieldVariant;
  placeholder?: string;
  characterLimit?: number;
  onFieldValueSet: (value: string | undefined) => void;
  edittingFieldValue?: string | null;
  errorMessage?: string;
  validator?: (value: string) => boolean;
  // UI Control
  allowEmpty?: boolean;
  cropShape?: 'round' | 'rect';
  // Special Operation
  trimmer?: (value: string) => string;
}
