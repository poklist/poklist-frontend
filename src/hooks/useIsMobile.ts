import useLayoutStore from '@/stores/useLayoutStore';
import { useEffect } from 'react';

const useIsMobile = () => {
  const setIsMobile = useLayoutStore((state) => state.setIsMobile);

  useEffect(() => {
    const checkIsMobile = () => {
      const _isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent || ''
        );
      setIsMobile(_isMobile);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [setIsMobile]);
};
export default useIsMobile;
