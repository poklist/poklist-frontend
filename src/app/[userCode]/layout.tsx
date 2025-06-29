import { notFound } from 'next/navigation';
import { migrateUserRoute, isUserRoute } from '@/lib/routeMigration';
import { ReactNode } from 'react';
import { UserRouteProvider } from './UserRouteProvider';

interface UserLayoutProps {
  children: ReactNode;
  params: Promise<{ userCode: string }>;
}

export default async function UserLayout({
  children,
  params,
}: UserLayoutProps) {
  const { userCode: rawUserCode } = await params;

  // 驗證是否為有效的用戶路由
  if (!isUserRoute(`/${rawUserCode}`)) {
    notFound();
  }

  // 清理userCode（移除@前綴如果存在）
  const cleanUserCode = migrateUserRoute(rawUserCode);

  return (
    <UserRouteProvider userCode={cleanUserCode}>
      <div>
        {/* 可以放置用戶profile layout */}
        {children}
      </div>
    </UserRouteProvider>
  );
}
