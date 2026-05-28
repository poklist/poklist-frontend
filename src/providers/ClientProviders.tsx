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
import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
  useIsMutating,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import { ReactNode, useState } from 'react';

interface ClientProvidersProps {
  children: ReactNode;
}

const GlobalLoading = () => {
  const { isLoading } = useCommonStore();
  // 之後看要不要加個 Filter 指定某些行為用其他的 Loading 方式
  const isFetching = useIsFetching();
  const isMutating = useIsMutating({
    predicate: (mutation) => {
      const keys = mutation.options.mutationKey;
      const isIgnoreKey =
        Array.isArray(keys) &&
        ['like', 'unlike', 'follow', 'unfollow'].some((ignoreKey) =>
          keys.includes(ignoreKey)
        );
      return !isIgnoreKey && mutation.state.status === 'pending';
    },
  });
  const isApiLoading = isFetching > 0 || isMutating > 0;

  return <LoadingSpinner isLoading={isLoading || isApiLoading} />;
};

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
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              const axiosError = error as AxiosError;
              const statusCode = axiosError.response?.status;

              if (
                statusCode === 401 ||
                statusCode === 403 ||
                statusCode === 404
              ) {
                return false;
              }

              if (failureCount >= 1) {
                return false;
              }

              return true;
            },
            staleTime: 60000,
            gcTime: 300000,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <Theme>
        <DrawerProvider>
          <FakePageProvider>
            {children}

            {/* 全域 UI 組件 */}
            <GlobalLoading />
            <LoginDrawer />
            <ErrorDrawer />
            <CreateListOrIdeaDrawer />

            <ReactQueryDevtools initialIsOpen={false} />
          </FakePageProvider>
        </DrawerProvider>
      </Theme>
      <Toaster />
    </QueryClientProvider>
  );
};
