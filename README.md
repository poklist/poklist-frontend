# Relist

**重新整理你的清單** — 建立和管理你的 Idea 清單，追蹤有趣的創作者，探索社群內容。

🔗 **Live Demo**: [relist.cc](https://relist.cc/)

---

## Features

- **清單管理** — 建立、編輯、刪除清單與 Idea
- **拖曳排序** — 以拖曳方式即時調整 Idea 順序
- **社群互動** — 追蹤用戶、按讚、探索他人清單
- **個人主頁** — 查看用戶資料、追蹤/被追蹤統計
- **i18n** — 繁體中文 / English 即時切換（Lingui）
- **Google OAuth** — 一鍵登入

---

## Tech Stack

| 類別 | 技術 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| API Layer | ts-rest + Axios (contract-first, end-to-end type-safe) |
| Server State | TanStack Query v5 |
| Client State | Zustand |
| Form | React Hook Form + Zod |
| UI | Radix UI + shadcn/ui + Tailwind CSS |
| Drag & Drop | react-virtual-sortable |
| i18n | Lingui (en / zh-TW) |
| Auth | Google OAuth (`@react-oauth/google`) |

---

## Architecture Highlights

### Contract-First API（ts-rest）
前後端共享同一份 contract schema，API 請求/回應型別在編譯期驗證，消除 runtime 型別錯誤。

### Abort Control
自製 `abortManager`（`src/lib/abortManager.ts`）管理 `AbortController` 生命週期：
- 路由切換時自動取消 in-flight requests
- 支援 whitelist 排除不應中斷的 API（如登入）
- 按 key（method + path）精準取消特定請求

### Optimistic Update + Rollback
按讚、追蹤等操作即時更新 UI，API 失敗時自動 rollback，提升感知效能。

### 型別安全的 Query Hooks
所有 query hooks 以 Zod schema 驗證 options，`onError` 型別對齊 ts-rest `ErrorResponse<TAppRoute>`，不依賴 `as` 型別斷言。

---

## Getting Started

需要 Node v22.15.1 / npm v10.9.2

```bash
npm i
npm run dev
```

### i18n

新增或修改翻譯後執行：

```bash
npm run build-lang
```

---

## Component Structure

| 類型 | 路徑 | 命名規則 |
|------|------|----------|
| shadcn/ui | `src/components/ui/*.tsx` | 小寫檔名 |
| 共用元件 | `src/components/<Name>/index.tsx` | 大寫資料夾 |
| 頁面元件 | `src/app/<page>/_components/<Name>/index.tsx` | 大寫資料夾 |
