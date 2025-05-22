import { useEffect, RefObject } from 'react';
import { useLocation } from 'react-router-dom';

interface UseScrollPositionOptions {
  keyPrefix?: string;
  restoreDelay?: number;
}

export function useScrollPosition(
  elementRef: RefObject<HTMLElement>,
  options: UseScrollPositionOptions = {}
) {
  const location = useLocation();
  const { keyPrefix = 'scroll_pos', restoreDelay = 0 } = options;
  const storageKey = `${keyPrefix}_${location.pathname}`;

  // 儲存滾動位置
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 處理滾動事件
    const handleScroll = () => {
      sessionStorage.setItem(storageKey, element.scrollTop.toString());
    };

    // 綁定滾動事件監聽器
    element.addEventListener('scroll', handleScroll);

    // 恢復滾動位置
    const savedPosition = sessionStorage.getItem(storageKey);
    if (savedPosition) {
      setTimeout(() => {
        if (element) {
          element.scrollTop = parseInt(savedPosition);
        }
      }, restoreDelay);
    } else {
      element.scrollTop = 0;
    }

    // 清理事件監聽器
    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [location.pathname, storageKey, restoreDelay, elementRef]);

  // 提供手動保存和恢復的方法
  const saveScrollPosition = () => {
    const element = elementRef.current;
    if (element) {
      sessionStorage.setItem(storageKey, element.scrollTop.toString());
    }
  };

  const restoreScrollPosition = (delay = restoreDelay) => {
    const element = elementRef.current;
    const savedPosition = sessionStorage.getItem(storageKey);

    if (element && savedPosition) {
      setTimeout(() => {
        element.scrollTop = parseInt(savedPosition);
      }, delay);
      return true;
    } else if (element) {
      element.scrollTop = 0;
      return false;
    }
    return false;
  };

  const clearScrollPosition = () => {
    sessionStorage.removeItem(storageKey);
  };

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
  };
}
