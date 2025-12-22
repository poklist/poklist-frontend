'use client';

import { UserRouteContext } from '@/hooks/useUserRouteContext';
import { ReactNode } from 'react';

interface UserRouteProviderProps {
  children: ReactNode;
  userCode: string;
}

export const UserRouteProvider = ({
  children,
  userCode,
}: UserRouteProviderProps) => {
  return (
    <UserRouteContext.Provider value={{ userCode }}>
      {children}
    </UserRouteContext.Provider>
  );
};
