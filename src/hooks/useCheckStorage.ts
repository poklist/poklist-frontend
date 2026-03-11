import { MessageType } from '@/enums/Style/index.enum';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import { checkAndMigrateStorage } from '@/lib/storage';
import useAuthStore from '@/stores/useAuthStore';
import { t } from '@lingui/macro';
import { useEffect } from 'react';

const useCheckStorage = () => {
  const { isLoggedIn, logout } = useAuthStore();
  const navigateTo = useStrictNavigateNext();

  useEffect(() => {
    if (!(isLoggedIn && checkAndMigrateStorage())) {
      return;
    }
    logout();
    navigateTo.discovery();
    toast({
      title: t`The app is outdated, please login again`,
      variant: MessageType.ERROR,
    });
  }, [isLoggedIn, navigateTo]);
};
export default useCheckStorage;
