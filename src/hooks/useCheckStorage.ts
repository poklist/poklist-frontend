import useStrictNavigate from '@/hooks/useStrictNavigate';
import { checkAndMigrateStorage } from '@/lib/storage';
import useAuthStore from '@/stores/useAuthStore';
import { t } from '@lingui/core/macro';
import { useEffect } from 'react';
import { useToast } from './useToast';

const useCheckStorage = () => {
  const { isLoggedIn, logout } = useAuthStore();
  const navigateTo = useStrictNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoggedIn && checkAndMigrateStorage()) {
      logout();
      navigateTo.discovery();
      toast({
        title: t`The app is outdated, please login again`,
        variant: 'success',
      });
    }
  }, []);
};
export default useCheckStorage;
