import { MessageType } from '@/enums/Style/index.enum';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import { checkAndMigrateStorage } from '@/lib/storage';
import useAuthStore from '@/stores/useAuthStore';
import { t } from '@lingui/core/macro';
import { useEffect } from 'react';

const useCheckStorage = () => {
  const { isLoggedIn, logout } = useAuthStore();
  const navigateTo = useStrictNavigateNext();

  useEffect(() => {
    if (isLoggedIn && checkAndMigrateStorage()) {
      logout();
      navigateTo.discovery();
      toast({
        title: t`The app is outdated, please login again`,
        variant: MessageType.ERROR,
      });
    }
  }, [isLoggedIn, logout, navigateTo, toast]);
};
export default useCheckStorage;
