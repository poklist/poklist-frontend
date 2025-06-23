// 導入已移除，因為功能已經被 App Router layout 替代

export interface UserRouteLayoutContextType {
  userCode: string;
}

interface UserRouteLayoutProps {
  children: React.ReactNode;
}

export default function UserRouteLayout({ children }: UserRouteLayoutProps) {
  // 在 Next.js App Router 中，這個組件的功能已經被 src/app/[userCode]/layout.tsx 和 UserRouteProvider 替代
  // 這個組件主要用於向下兼容或者特定的布局需求

  // 直接返回 children，因為 userCode 的處理已經在 App Router layout 中完成
  return (
    <div>
      {/* Can put user profile layout */}
      {children}
    </div>
  );
}
