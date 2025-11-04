import { MessageType } from '@/enums/Style/index.enum';

export type PartialRecord<K extends string | number | symbol, T> = {
  [P in K]?: T;
};
export interface FormErrorDetail {
  type: 'too_small' | 'too_big' | 'invalid';
  message?: string;
}
export interface ErrorMessage {
  drawer?: { title: string; content: string };
  toast?: { title: string; variant: MessageType };
}
// Form Error 結構
export type FormErrors = Record<string, FormErrorDetail>;
