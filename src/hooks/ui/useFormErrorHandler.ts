import { toast } from '@/hooks/useToast';
import useCommonStore from '@/stores/useCommonStore';
import { ErrorMessage, FormErrorDetail } from '@/types/common';
import { FieldErrors } from 'react-hook-form';

interface UseFormErrorHandlerOptions {
  resolver: (key: string, value: FormErrorDetail) => ErrorMessage | null;
}

const useFormErrorHandler = <T extends Record<string, unknown>>({
  resolver,
}: UseFormErrorHandlerOptions) => {
  const { setErrorDrawerMessage } = useCommonStore();

  return (errors: FieldErrors<T>) => {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;

    const fieldError = errors[firstKey];
    const errorType = (fieldError?.type ??
      'invalid') as FormErrorDetail['type'];

    const resolved = resolver(firstKey, { type: errorType });
    if (resolved?.drawer) {
      setErrorDrawerMessage(resolved.drawer);
    }
    if (resolved?.toast) {
      toast(resolved.toast);
    }
  };
};

export default useFormErrorHandler;
