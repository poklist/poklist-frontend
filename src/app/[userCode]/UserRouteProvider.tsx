'use client';

import { ReactNode } from 'react';
import { UserRouteContext } from '@/hooks/useUserRouteContext';

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
