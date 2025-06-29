# Providers 架構說明

本目錄包含統一的 Provider 架構，為 Next.js App Router 遷移做好準備。

## 新架構設計

### 統一的 Provider 架構

我們採用統一的架構，所有 Provider 都集中管理：

**AppProviders** - 統一的應用 Provider

- LanguageProvider: 多語言支援（SSR 安全）
- ClientProviders: 所有客戶端 Provider
  - QueryClientProvider: React Query
  - Theme: Radix UI 主題
  - DrawerProvider: 抽屜狀態管理
  - FakePageProvider: 假頁面狀態管理
  - Toaster: 通知組件
  - ReactQueryDevtools: 開發工具

## 目前的使用方式

### App Router（app/layout.tsx）

```tsx
import { AppProviders } from '@/providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProviders>
          <div id="root">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
```

### App Router Client（app/[[...slug]]/client.tsx）

```tsx
// 簡化為純粹的應用導入，不需要重複 Provider
export function ClientOnly() {
  return <App />;
}
```

### Pages Router（pages/Layout/index.tsx）

現在移除了所有 Provider，因為它們已經在 App Router 層級統一處理。

## 遷移狀態

- ✅ Provider 架構統一重組完成
- ✅ App Router 根 layout 整合所有 Provider
- ✅ 移除重複的 Provider 包裝
- ✅ Pages Router layout 完全簡化
- ⏳ 待定：後續的頁面遷移

## 優勢

1. **完全統一**：所有 Provider 都在一個地方管理
2. **未來友好**：移除過渡檔案時不需要重新整合
3. **避免重複**：不會有多處定義 Provider 的問題
4. **清晰架構**：Server Component → Client Component → 應用內容
5. **維護性**：集中管理，易於調整和擴展

## 檔案結構

```
src/providers/
├── index.tsx           # 主要的 AppProviders
├── client-providers.tsx # 客戶端專用 Provider
└── README.md          # 說明文件
```

## 測試方式

1. 啟動開發伺服器：`npm run dev`
2. 確認現有功能正常運作（語言切換、抽屜、假頁面、React Query 等）
3. 檢查 Radix Theme 樣式是否正確載入
4. 確認通知（Toaster）功能正常

如有問題，請檢查控制台錯誤訊息。
