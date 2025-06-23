import { createContext, useContext } from 'react';

export interface UserRouteLayoutContextType {
  userCode: string;
}

// 創建Context來提供userCode給子組件
export const UserRouteContext =
  createContext<UserRouteLayoutContextType | null>(null);

// 提供Hook來使用Context（向後兼容）
export const useUserRouteContext = () => {
  const context = useContext(UserRouteContext);
  if (!context) {
    throw new Error('useUserRouteContext must be used within UserLayout');
  }
  return context;
};
