import { UserRouteProvider } from '@/app/[userCode]/UserRouteProvider';
import { ReactNode } from 'react';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <UserRouteProvider>
      <div>
        {/* 可以放置用戶profile layout */}
        {children}
      </div>
    </UserRouteProvider>
  );
}
