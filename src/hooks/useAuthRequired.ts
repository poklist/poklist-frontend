import { useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import useCommonStore from '@/stores/useCommonStore';
import { t } from '@lingui/core/macro';

/**
 * 統一的認證處理 hook
 *
 * 當用戶未登入時觸發登入抽屜並顯示提示訊息。
 * 這個 hook 確保在整個應用中，未登入用戶的操作都有一致的處理方式。
 */
export const useAuthRequired = () => {
  const { setIsLoginDrawerOpen } = useCommonStore();
  const { toast } = useToast();

  const handleAuthRequired = useCallback(() => {
    setIsLoginDrawerOpen(true);
    toast({
      title: t`Please login to do this action`,
      variant: 'destructive',
    });
  }, [setIsLoginDrawerOpen, toast]);

  return { handleAuthRequired };
};
