'use client';

import { UserRouteLayoutContextType } from '@/pages/Layout/UserRouteLayuout';
import { useUserRouteContext } from './useUserRouteContext';

/**
 * 兼容性hook，在App Router環境中使用Context，在React Router環境中使用useOutletContext
 * 這個hook應該在App Router環境中使用，會從UserRouteProvider獲取userCode
 */
export const useUserContext = (): UserRouteLayoutContextType => {
  // 在App Router環境中，使用Context來獲取userCode
  // 這會從UserRouteProvider中獲取值
  return useUserRouteContext();
};
