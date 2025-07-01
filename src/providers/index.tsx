'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/components/Language';
import { ClientProviders } from './ClientProviders';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * 應用程式完整 Provider 架構
 *
 * 整合了所有必要的 Provider：
 * - LanguageProvider: 多語言支援（SSR 安全）
 * - ClientProviders: 所有客戶端 Provider（React Query、Theme、Drawer、FakePage 等）
 *
 * 這個組件設計為未來 App Router 完全遷移時的最終架構
 * 所有 Provider 都集中在這裡管理，避免重複包裝
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <LanguageProvider>
      <ClientProviders>{children}</ClientProviders>
    </LanguageProvider>
  );
};
