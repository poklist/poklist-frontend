'use client';

import { DrawerProvider } from '@/components/Drawer';
import CreateListOrIdeaDrawer from '@/components/Drawer/CreateListOrIdeaDrawer';
import { LoginDrawer } from '@/components/Drawer/LoginDrawer';
import { ErrorDrawer } from '@/components/ErrorDrawer';
import { FakePageProvider } from '@/components/FakePage';
import LoadingSpinner from '@/components/Loading';
import { Toaster } from '@/components/ui/toaster';
import useCommonStore from '@/stores/useCommonStore';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

// 將 QueryClient 實例化移到組件外部
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    },
  },
});

interface ClientProvidersProps {
  children: ReactNode;
}

/**
 * 客戶端 Provider 組件
 *
 * 處理所有需要瀏覽器環境的 Provider 和組件：
 * - QueryClientProvider: React Query
 * - Theme: Radix UI
 * - DrawerProvider: 抽屜狀態管理
 * - FakePageProvider: 假頁面狀態管理
 * - 全域 UI 組件: Loading, Alert, Error, Login, CreateListOrIdea, Toast
 * - ReactQueryDevtools: 開發工具
 */
export const ClientProviders = ({ children }: ClientProvidersProps) => {
  const { isLoading } = useCommonStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Theme>
        <DrawerProvider>
          <FakePageProvider>
            {children}

            {/* 全域 UI 組件 */}
            <LoadingSpinner isLoading={isLoading} />
            <LoginDrawer />
            <ErrorDrawer />
            <CreateListOrIdeaDrawer />
            <Toaster />

            <ReactQueryDevtools initialIsOpen={false} />
          </FakePageProvider>
        </DrawerProvider>
      </Theme>
    </QueryClientProvider>
  );
};
