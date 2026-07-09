'use client';

import { UserRouteContext } from '@/hooks/useUserRouteContext';
import { isUserRoute, migrateUserRoute } from '@/lib/routeMigration';
import { notFound, useParams } from 'next/navigation';
import { ReactNode } from 'react';

interface UserRouteProviderProps {
  children: ReactNode;
}

export const UserRouteProvider = ({ children }: UserRouteProviderProps) => {
  const params = useParams();
  const rawUserCode = (params?.userCode as string) ?? '';

  // 靜態 shell prerender 時 params 為空 → 跳過驗證（hydration 後有真值才驗）
  if (rawUserCode && !isUserRoute(`/${rawUserCode}`)) {
    notFound();
  }

  const userCode = rawUserCode ? migrateUserRoute(rawUserCode) : '';

  return (
    <UserRouteContext.Provider value={{ userCode }}>
      {children}
    </UserRouteContext.Provider>
  );
};
