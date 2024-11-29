import useUserStore from '@/stores/useUserStore';
import { useEffect, useState } from 'react';

export default function useIsMyPage(userID: string | undefined | number) {
  const { user: me } = useUserStore();
  const [isMyPage, setIsMyPage] = useState(false);

  useEffect(() => {
    setIsMyPage(userID?.toString() === me.id.toString());
  }, [userID]);

  return isMyPage;
}
