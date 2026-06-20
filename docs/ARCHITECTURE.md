# Relist 專案接管手冊 (Architecture & Handover)

> 對象：未曾接觸本 repo 的工程師或 AI 模型。
> 目標：在不需要逐檔閱讀的情況下，能正確判斷「該把新功能寫在哪、為什麼這樣寫、地雷在哪」。
> 補充閱讀：
>
> - `docs/functional-programming.md`：FP 工具與 `useAuth*` 高階 hook
> - `src/components/README.md`、`src/components/ui/README.md`：元件層級規約
> - `src/components/Drawer/README.md`、`src/providers/README.md`：Provider 規範

---

## 1. 產品與專案速覽

- **品牌**：Relist（網域 `relist.cc`）。早期內部稱 *Poklist*，repo 名與部分 mock data 仍保留此命名。
- **產品形態**：行動裝置優先（max width 430 px）的「清單社群」。使用者建立 `List → Idea`，並可被 Like、Follow、Discovery、Official Collections 等社交流瀏覽。
- **package.json `name`**：`relist`，private。
- **Node 版本**：22.15.1（npm 10.9.2）。Docker 內亦使用 `node:22-alpine`。
- **預設 dev port**：8080（`next dev -p 8080`）。Docker container 內為 5173。
- **入口流程**：`/` → `useEffect` redirect 到 `/discovery`（[src/app/page.tsx](src/app/page.tsx)）。

---

## 2. 技術棧總覽

| 類別 | 套件 | 角色 |
|---|---|---|
| Framework | `next@14.2.35`（App Router, `output: 'standalone'`） | SSR / RSC、檔案系統路由 |
| Language | `typescript@^5.5`、`strict` 開啟，`noUnusedLocals/Parameters` | 全專案類型保證 |
| UI Library | `@radix-ui/*`、`@radix-ui/themes`、shadcn 風格 [src/components/ui](src/components/ui)、`vaul`（drawer base）、`lucide-react`、`react-easy-crop`、`react-virtual-sortable` + `sortable-dnd` | 元件 / 互動 |
| Styling | `tailwindcss@^3.4`、`tailwindcss-animate`、`class-variance-authority`、`clsx`、`tailwind-merge`、`prettier-plugin-tailwindcss` | 設計系統與 className 合併 |
| State | `zustand@^5` + `zustand/middleware` (persist) | 客戶端全域狀態 |
| Server State | `@tanstack/react-query@^5.72`、`react-query-devtools` | 快取 / 失效 / Mutation |
| HTTP | `axios@^1.15` + 自訂攔截器 [src/api/axios.ts](src/api/axios.ts) | 所有對後端的請求 |
| Contract / 驗證 | `@ts-rest/core`、`@ts-rest/react-query`、`zod@^3.23` | 新版 contract-first API 層（與舊 axios hooks 共存中） |
| Form | `react-hook-form@^7.53` + `@hookform/resolvers/zod` | Form 與驗證 |
| i18n | `@lingui/core`、`@lingui/react`、`@lingui/macro`、`@lingui/swc-plugin`（Next experimental swcPlugins） | 多語系 `en` / `zh-TW` |
| Auth | `@react-oauth/google`（Google One-Tap / 標準按鈕） | 第三方登入 |
| Date | `moment` | PostgreSQL 時間字串解析 |
| Edge / 函式 | `@netlify/functions`（依存在但目前未直接使用） | 未來邊緣函式預備 |
| Build / Lint | `eslint@^8` + `typescript-eslint` + `next/core-web-vitals`、Prettier、SWC | 程式碼品質 |
| Deployment | **Netlify** 為主（[netlify.toml](netlify.toml)：build = `npm run build`、publish = `.next`，含完整 Security Headers / CSP） / **Dockerfile**（Cloud Run target，硬編 `NEXT_PUBLIC_*` 三個變數） | 雙軌部署 |

`next.config.mjs` 重點：

- `experimental.swcPlugins`：注入 `@lingui/swc-plugin`，讓 `t` / `Trans` 在 build time 處理。
- `optimizePackageImports`：列出 radix、tanstack、lingui、zod、zustand、lucide 等，減少 bundle。
- `eslint.ignoreDuringBuilds: true`：CI 不會因為 lint 失敗中斷。
- `images.remotePatterns`：僅允許 `https://image.relist.cc/**`。新增來源時必須在此白名單。

---

## 3. 目錄結構（語意分層）

```
src/
├── app/                  # Next App Router 頁面 + 頁面私有元件（_components / _hooks）
│   ├── layout.tsx        # 全站 RootLayout：字型、metadata、AppProviders、ConditionalLayout
│   ├── page.tsx          # `/` → redirect /discovery
│   ├── [userCode]/       # 動態 user 路由（去除 @ 前綴後的 userCode）
│   │   ├── layout.tsx        # 驗證 userRoute、提供 UserRouteProvider
│   │   ├── page.tsx          # 個人頁 (TileBackground + HeroSection + ListSection)
│   │   ├── edit/             # 自身 profile 編輯
│   │   └── list/[id]/        # 名單檢視 / edit / reorder / idea drawer
│   ├── discovery/        # 首頁 feed（lazy IntersectionObserver、scroll restore via sessionStorage）
│   ├── official/         # 官方介紹頁
│   ├── settings/         # 設定（語言切換、Block、Links）
│   ├── idea/、list/      # 建立 / 編輯流程（Form 在這裡）
│   ├── error/、goToMobile/、not-found.tsx
│   └── _layout/_shared/  # 桌面包殼用的背景、BottomNav、PromptText…
├── api/                  # **新**版 API 層：ts-rest contracts + zod schemas + react-query 整合
│   ├── axios.ts          # axios 實例 + interceptors + AbortController tracking
│   ├── fetcher.ts        # ts-rest 用的 axiosFetcher（將 axios response 包成 ts-rest 介面）
│   ├── whitelist.ts      # ABORT_WHITELIST：不可被 abortAll() 取消的 API
│   ├── contracts/        # ts-rest AppRoute 定義
│   ├── schemas/          # zod schemas（同時導出 request / response）
│   └── query/            # 由 contracts 派生的 react-query client (`initQueryClient`)
├── hooks/
│   ├── api/              # **新**版 query hooks：包 `xxxQuery.method.useQuery`，schema 預設值 by zod
│   │                      # categories / discovery / followers / followings / ideas / lists
│   ├── queries/          # **舊**版 query hooks：直接 axios + useQuery（部分仍是唯一實作）
│   │   └── infinite/     # useInfiniteIdea / useInfiniteLists
│   ├── mutations/        # 全部 mutation hooks（含樂觀更新 / 防抖 / cache invalidation）
│   │   └── optimisticUpdateHandler.ts  # 共用工廠：delta + rollback
│   ├── ui/               # useAutoResizeTextarea、useFormErrorHandler
│   ├── useAuth.ts        # FP 風格 hook：useAuthCheck / useAuthProtect / useAuthPipe / useAuthWrapper / useConditionalExecution
│   ├── useAuthRequired.ts# 「未登入時打開 LoginDrawer + toast」的單一入口
│   ├── useStrictNavigateNext.ts # **全站唯一允許的路由方法**（useTransition + 自動 setIsLoading）
│   ├── useToast.ts       # react-hot-toast 風格 reducer，TOAST_LIMIT=1
│   ├── useUserRouteContext.ts   # 取得 [userCode] 路由 context
│   ├── useCheckStorage.ts# 啟動時做 localStorage 版本遷移
│   ├── useIsMobile.ts、useIdle.ts、useTimeout.ts、useClipboard.ts、useScrollPosition.ts、useAutosizeTextArea.ts
├── stores/               # Zustand stores（皆 default export）
│   ├── useAuthStore.ts        # isLoggedIn / accessToken；persist=auth-storage；logout 連動 user/editProfile
│   ├── useUserStore.ts        # 目前登入者 `me`；persist=user-storage
│   ├── useCommonStore.ts      # 全域 isLoading、errorDrawerMessage、isLoginDrawerOpen
│   ├── useEditProfileStore.ts # 編輯中的 newUserInfo + isModified()
│   ├── useFollowingStore.ts   # Map<userCode, {followingState, followerCount}>
│   ├── useLikeStore.ts        # Map<listID, isLiked>
│   ├── useLayoutStore.ts      # isMobile
│   ├── useTemporaryIdeaStore.ts # 草稿轉場用，雙寫 localStorage
│   └── useUIStore.ts          # scrollToTop fn、Discovery expandedCategories
├── providers/            # 統一 Provider 入口
│   ├── index.tsx          # AppProviders = LanguageProvider > ClientProviders
│   └── ClientProviders.tsx# QueryClientProvider + Radix Theme + Drawer / FakePage Provider + 全域 Loading/Login/Error/CreateDrawer/Toaster + Devtools
├── components/
│   ├── ui/               # shadcn 風格基礎元件，**檔名小寫**；button.tsx 內定義 Variant/Size/Shape enum
│   ├── Drawer/、FakePage/、Language/  # Context Provider 套件（含 README）
│   ├── Header/、Footer/、ImageUploader/、ImageCropper/、ImagePreview/、Dropdown/、Radio/、Loading/、ErrorDrawer/、ConditionalLayout/
│   └── README.md         # 元件分層規約（**必讀**）
├── constants/            # apiPath / queryKeys / routes / form / list / i18n / DragAndDrop / Drawer (DrawerIds) / Home / Lists / User / externalLink
├── enums/                # 全域 Enums（index.enum.ts 為入口），分子目錄 Style / Lists / EditField
├── types/                # 各領域型別：User / List / Idea / Discovery / Relation / Settings / Home / EditField；common.ts 內含 zod schema (IdeaFormSchema/ListFormSchema)
├── lib/                  # 純函式工具，不含 hook
│   ├── utils.ts          # cn、localStorage helpers、to (Promise tuple)、檔案 / Base64 / URL 處理
│   ├── functional.ts     # compose / pipe / when / curry / partial / memoize / throttle / debounce / enhancedDebounce / sortObjectKeys
│   ├── abortManager.ts   # 全域 AbortController 管理（track/untrack/abortAll/abortKey）
│   ├── storage.ts        # checkAndMigrateStorage：版本不符就 localStorage.clear()
│   ├── routeMigration.ts # @ 前綴遷移與 isUserRoute 系統路由判斷
│   ├── metadata.ts       # createBaseMetadata / OpenGraph / Twitter 工廠
│   ├── time.ts           # 解析 PG datetime + locale 格式化
│   ├── validator.ts      # validateUserCode + resolveListFormError / resolveIdeaFormError
│   └── openLink.ts       # window.open noopener noreferrer
├── locales/              # lingui 編譯產物（en / zh-TW）
├── assets/               # 靜態圖片、SVG
└── index.css             # Tailwind layer 與 CSS variable
```

### Component Folder Rules（強制）

源自 [README.md](README.md)，違反者視為 *legacy*：

1. shadcn UI → `@/components/ui/<lowercase>.tsx`
2. 全站共用元件 → `@/components/<PascalCase>/index.tsx`
3. 頁面專屬元件 → `@/app/<route>/_components/<PascalCase>/index.tsx`
4. 頁面專屬 hook → `_hooks/`；頁面 client component → `client.tsx`（如 `app/[userCode]/list/[id]/client.tsx`）

---

## 4. 三大跨切核心

### 4.1 Provider 階層（從外到內）

```
<html><body>
  AppProviders
   └─ LanguageProvider          # 載入 messages.ts，使用 WatchLocale 強制 re-render
       └─ I18nProvider
       └─ ClientProviders
           └─ QueryClientProvider (retry: 401/403/404 不重試 + 一次失敗止損；staleTime 60s, gcTime 5min)
               └─ Radix <Theme>
                   └─ DrawerProvider   # Set<drawerId> 管理多抽屜
                       └─ FakePageProvider  # 'editField' | 'listSelector' 兩種 pageType + payload
                           ├─ children
                           ├─ GlobalLoading (聽 useCommonStore + useIsFetching/Mutating)
                           ├─ LoginDrawer
                           ├─ ErrorDrawer
                           ├─ CreateListOrIdeaDrawer
                           └─ ReactQueryDevtools
               └─ <Toaster /> (UI sibling)
└─ ConditionalLayout            # mount 後再判斷裝置；非 mobile UA 強制導去 /goToMobile（除白名單）
```

要點：

- **`'use client'` 邊界**：`AppProviders`、`LanguageProvider`、`ClientProviders` 皆是 client component；`app/layout.tsx` 維持 RSC。`generateMetadata` 仍跑在 server side（見 `app/[userCode]/list/[id]/page.tsx`，會在 SSR 直接呼叫後端 `/lists/:id` 與 `/:userCode/info` 用作 OG）。
- **裝置偵測雙軌**：`useIsMobile` 寫入 `useLayoutStore`，並由 `ConditionalLayout` 攔截 desktop UA 導向 `/goToMobile`。任何全站新頁面務必加進白名單（目前只有 `/error`、`/goToMobile`），否則桌面會 redirect。

### 4.2 API 雙軌：新 `hooks/api/*` (ts-rest) 與舊 `hooks/queries/*` (axios)

整個 codebase 正在**從舊往新遷移**（commit 紀錄：`feat: ts-rest`、`fix: support new query key`、`feature/abort-control`）。兩種寫法都會出現：

| 維度 | 舊版（仍是大宗） | 新版（首選） |
|---|---|---|
| 路徑 | `src/hooks/queries/*`、`src/hooks/mutations/*` | `src/hooks/api/<resource>/*` + `src/api/contracts/`、`src/api/schemas/`、`src/api/query/` |
| 請求 | `axios.get<IResponse<T>>(path)` 手寫 | `xxxContract` → `initQueryClient(.., { api: axiosFetcher })` → `useQuery` |
| 驗證 | TypeScript interface（無 runtime check） | zod schema (`createResponseSchema(...)`) |
| Query Key | 字串常數 `QueryKeys`（`constants/queryKeys.ts`） | `xxxKeys.list(id)`（`hooks/api/<resource>/keys.ts`） |
| 預設值 | 函式參數 default | zod schema `.default(...)` |

**重要**：兩套 query key 並存，所以失效時可能需要同時 invalidate 兩個（如 `useEditList`、`useReorderIdeas`、`useCreateIdea` 等已示範）。新功能優先沿用新版，但若舊版 hook 已足夠就**不要重寫**，以免拉開更多分歧。

### 4.3 共用網路機制（[src/api/axios.ts](src/api/axios.ts)）

- 請求攔截：
  - 自動建立 `AbortController` 並 `track(controller, '<METHOD> <path>')` 到 [src/lib/abortManager.ts](src/lib/abortManager.ts)（白名單 [src/api/whitelist.ts](src/api/whitelist.ts) 排除）。
  - 注入 `Authorization: Bearer <accessToken>`，token 來自 `useAuthStore.getState().accessToken`。
- 回應攔截：
  - 非 2xx：toast error 並 reject。
  - `error.name === 'CanceledError'`：開發環境 warn，不彈 toast。`isDebug: true` 時也 warn。
  - **401 → 自動 `logout()` + `window.location.href = '/'`**（會清空 zustand persist）。
- `interface AxiosPayload { params?, data? }` 是後續 mutation hook 的標準輸入。

**全域取消**：`abortAll()` / `abortKey()` 可用於頁面切換時批次取消未完成請求。若有 race-sensitive API（例如登入後立刻打 /me），請加入 `ABORT_WHITELIST`，否則可能在路由切換時被殺。

### 4.4 樂觀更新 + 防抖模板

`useLikeAction` / `useFollowAction` 是兩個範本，模式為：

1. 全模組共享 `debounceMap: Map<string, Timeout>`，key 用 `like-<listID>` / `follow-<userCode>`。
2. 點擊 → 先呼叫 `createOptimisticUpdateHandler(delta, targetUserID, updateCache).optimisticUpdate()`（更新 zustand + react-query cache）。
3. `setTimeout(mutation.mutate, debounceMs = 5000)`，發生錯誤時 `rollback()`。
4. `shouldAllow` / `onNotAllowed` 由呼叫端注入；常見組合：`shouldAllow: () => isLoggedIn`、`onNotAllowed: handleAuthRequired`（[useAuthRequired](src/hooks/useAuthRequired.ts) 會打開 LoginDrawer + toast）。

未來新增「點擊型社交動作」時請沿用此模式而非重寫 mutation。

---

## 5. 全域狀態（Zustand）策略

| Store | 持久化 | 重點 |
|---|---|---|
| `useAuthStore` | `auth-storage` | logout 會連動清空 `useUserStore.me` 與 `useEditProfileStore.newUserInfo` |
| `useUserStore` | `user-storage` | `me` 預設 `emptyUser`（避免 `me?.` 漫天散落） |
| `useEditProfileStore` | ❌ | 暫存 profile 編輯，提供 `isModified()` 比對 |
| `useCommonStore` | ❌ | 全域 Loading / LoginDrawer / ErrorDrawer 三個 UI 開關 |
| `useFollowingStore` | ❌ | Map 結構支援多 userCode 並行 |
| `useLikeStore` | ❌ | Map 結構支援多 listID 並行 |
| `useLayoutStore` | ❌ | isMobile，僅在 client mount 後賦值 |
| `useTemporaryIdeaStore` | localStorage 雙寫 | 草稿跨路由傳遞 |
| `useUIStore` | ❌ | scrollToTop 函數注入、Discovery 展開狀態 |

**LocalStorage 結構**（`LocalStorageKey` enum）：

- `_storage_version`：版本字串，與 `STORAGE_VERSION`（`src/lib/storage.ts`）比對，不合就 `localStorage.clear()` 並要求重登入。**【未來規劃】** `STORAGE_VERSION` 與 `package.json` 版本應自動同步（例如 build script 讀取 package.json version 寫入常數），屆時只需改 `package.json` 版本即可，不再需要同步修改兩處。
- `selected_language`、`selected_location`、`idea_draft`、`list_draft`。

---

## 6. 路由與導航

### 6.1 路由地圖

| 路徑 | 元件 | 備註 |
|---|---|---|
| `/` | redirect → `/discovery` | |
| `/discovery` | `app/discovery/page.tsx` | Hero / Section / Footer，IntersectionObserver lazy |
| `/official` | `app/official/page.tsx` | 介紹頁 |
| `/settings` | `app/settings/page.tsx` | |
| `/error`、`/goToMobile`、`/not-found` | 系統頁 | `/goToMobile` 屬 desktop redirect 白名單 |
| `/[userCode]` | profile，layout 驗證 isUserRoute | 同時是 `/<userCode>/list/<id>` 的 layout 根 |
| `/[userCode]/edit` | profile 編輯 | |
| `/[userCode]/list/[id]` | server component（generateMetadata + 404 校驗）→ `client.tsx` | |
| `/[userCode]/list/[id]/edit` / `/reorder` / `/idea/[ideaID]` | list 子流程 | |
| `/idea/create`、`/idea/create/list`、`/idea/[ideaID]/edit` | Idea 建立/編輯 | |
| `/list/create` | List 建立 | |

`StaticRoutes`（[src/constants/routes.ts](src/constants/routes.ts)）是字串常數來源，新加路徑請更新它。

### 6.2 唯一導航入口：[useStrictNavigateNext](src/hooks/useStrictNavigateNext.ts)

- 所有 `router.push / replace / back` **必須**透過此 hook，原因：
  - 內建 `useTransition`，pending 期間自動 `setIsLoading(true)` 觸發 GlobalLoading。
  - `migrateUserRoute` 自動去掉 `@` 前綴（向舊 URL 兼容）。
  - 包含 `temporaryCreateList` 等需要把 form 暫存到 store 才導頁的 atomic 行為。
- **不要**在元件內直接 `useRouter()`；只有 `useStrictNavigateNext` 是合法的封裝點。

### 6.3 isUserRoute 系統路由黑名單

`lib/routeMigration.ts` 內 `systemRoutes` 列舉：`discovery / official / settings / user / list / idea / error / goToMobile`。新增系統頁時請同步維護，否則動態 `[userCode]` 會把它吃掉變 404。

---

## 7. 表單與驗證模式

- Schema 一律放 `src/types/common.ts`（`IdeaFormSchema` / `ListFormSchema`），透過 `zodResolver` 套入 react-hook-form。
- 共用 helpers：
  - `formatInput`：合併多空白、移除換行。
  - `validateUserCode`、`resolveListFormError`、`resolveIdeaFormError`（lingui macro 內含 dynamic 字串）。
  - `useFormErrorHandler({ resolver })`：抓取第一個 error，依 resolver 決定要彈 `setErrorDrawerMessage` 還是 `toast`。
- **草稿機制**（List/Idea Form 一致）：
  1. 開頁先檢查 `getLocalStorage(LocalStorageKey.IDEA_DRAFT/LIST_DRAFT, schema)`，有 → `openDraftDrawer()` 詢問恢復或丟棄。
  2. 編輯時用 `useIdle({ timeout: 2000, watch: form.watch })`，閒置 2 秒就 `setLocalStorage(...)`。
  3. Submit 成功時清掉 draft（透過 `useTemporaryIdeaStore.clearIfMatchLocalStorage`）。
- **autosize textarea**：兩個版本共存 — `hooks/ui/useAutoResizeTextarea`（新，首選）與 `useAutosizeTextArea`（舊）。**【未來規劃】** 兩者需合併為單一 hook，舊版呼叫端遷移完畢後刪除 `useAutosizeTextArea`。在此之前新表單一律使用 `hooks/ui/useAutoResizeTextarea`。

---

## 8. UI 慣例

- **設計尺寸**：行動裝置優先；`w-mobile-max = 430px`、`h-desktop-container = calc(100vh - 102px)` 是 Tailwind extend。
- **色票**：[tailwind.config.js](tailwind.config.js) 內 `black-text-01 / black-icon-02 / yellow-bright-01 / green-bright-01 / gray-storm-01 / red-warning-01 …`。HSL var 系列 (`--background`、`--primary` 等) 走 shadcn / Radix 預設，仍存在但**目前不是設計主軸**，請優先使用具語意命名的色票。
- **字體**：`Inter`（latin）與 `Noto Sans` 透過 `next/font/google` 注入為 CSS variable，自訂 fontSize token：`h1 / h2 / t1 / t2 / t3`。
- **Button**（[src/components/ui/button.tsx](src/components/ui/button.tsx)）：使用 enum (`ButtonVariant / Size / Shape`)，請優先使用 enum 而非字串字面值，預設 `WHITE / MD / ROUNDED_FULL`。
- **Drawer 樣式**：底部 vaul drawer 包了一層 `DrawerComponent`（含 header / subHeader / content / startFooter / endFooter / close）。任何「下拉抽屜」UI 請走 `DrawerComponent` + `DrawerIds` 註冊，不要直接動 vaul。
- **FakePage**：模仿全頁 modal 的 dialog，目前兩種 type：`editField`（編輯單一欄位，textarea 或圖片裁切）、`listSelector`（建立 idea 時挑 list）。要新增「假頁」請在 `FakePageType` union 加入並更新 `FakePagePayloadMap`。

---

## 9. 國際化 (Lingui)

- 設定：[lingui.config.js](lingui.config.js)；catalog 在 `src/locales/{locale}/messages.{po,ts}`。
- 流程：`npm run extract` → 收集 → `npm run compile` 產生 ts；`npm run dev` / `build` 已包含這兩步。
- 使用方式：
  - JSX：`<Trans>...</Trans>`
  - 字串：`` t`...` ``、或 `msg`...`` + `i18n._(...)`（[src/constants/i18n.ts](src/constants/i18n.ts) 的 `EntityNameI18n` 範例）
  - 動態 key 對應：例如 Discovery section title 用 `CATEGORY_TITLES[lowerName]`，這些 key 都要事先在 `t\`...\`` 列出，extract 才會抓到。
- Language 切換：`Language` enum + `activateI18n(locale)` + `LocalStorageKey.SELECTED_LANGUAGE`；切換後 `WatchLocale` 透過 `key={locale}` 強制整棵子樹 remount。

---

## 10. 部署與安全

- **Netlify**：`netlify.toml` 設定 CSP / X-Frame / Referrer / Permissions Policy 等。CSP 允許的 connect-src 只有 `*.google.com` + Google API + 三個後端 host (`poklist-be-dev-...`、`relist-dev-...`、`dev-api.relist.cc`) — 新增第三方 API 時需修改這裡，否則 production 會被阻擋。
- **Dockerfile**：multi-stage（deps / builder / runner），`output: 'standalone'` 對應 `node server.js`。注意 `ENV NEXT_PUBLIC_*` 在 builder stage 寫死（含 prod baseURL、Google client ID、site URL）—若要做 staging build 需另建 image。
- **環境變數**（[.env.example](.env.example)）：
  - `NEXT_PUBLIC_API_BASE_URL`
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
  - `NEXT_PUBLIC_SITE_URL`
  以 `NEXT_PUBLIC_` 開頭，皆暴露給瀏覽器；**不要**把任何 secret 放進 `NEXT_PUBLIC_*` 變數。

### 安全重點（必讀）

- **`accessToken` 儲存位置**：目前存於 Zustand persist（`auth-storage` → `localStorage`）。LocalStorage 可被同源 JS 讀取，因此任何 XSS 漏洞都會導致 token 外洩。務必確保：
  - 不引入會執行任意字串為 HTML/script 的 API（`dangerouslySetInnerHTML`、`eval`、`new Function` 等）。
  - 所有第三方 script/SDK 僅從白名單 host 載入（已由 CSP `script-src` 管控）。
- **CSP 維護**：每次新增外部資源（CDN、Font、API、圖片 domain）都必須同步更新 `netlify.toml` 對應指令，並驗證 staging 上的 CSP header — `Report-Only` 模式可先觀察再上線。
- **`localStorage.getItem` 使用限制**（見 § 15 規約）：除了 `src/lib/storage.ts` 的 `STORAGE_VERSION` 版本比對外，其他任何地方**不得**直接呼叫 `localStorage.getItem/setItem/removeItem`；必須使用 `getLocalStorage / setLocalStorage / removeLocalStorage`（`src/lib/utils.ts`），並搭配 zod schema 驗證，防止讀到格式不正確的資料導致 runtime crash 或資料污染。
- **`images.remotePatterns`**：`next.config.mjs` 目前只允許 `https://image.relist.cc/**`；新增圖片來源時同步更新此白名單，否則 Next.js Image 最佳化會直接拋錯。
- **圖片上傳流程（現況 vs 未來）**：
  - 現況：前端將圖片轉為 base64 dataURL，與其他表單資料一起送出。
  - **【未來規劃】** 改為先將圖片上傳給 BE → BE 回傳圖片 URL / 資源 ID → 再把回傳結果連同其他表單資料一起送出。此流程可降低主請求 payload 大小、讓圖片 CDN 處理在後端統一進行，設計新圖片相關表單時請預留此介面。
- **401 自動登出**：axios 攔截器已統一處理，不要在其他地方重複實作跳轉邏輯，避免與攔截器競爭造成雙重 redirect。

---

## 11. 工程實踐 / Style

- **ESLint**：`no-console: ['error', { allow: ['warn', 'error'] }]`，但 `next.config.mjs` 的 `eslint.ignoreDuringBuilds: true` 表示 build 不擋 — 仍需手動 `npm run lint`。
- **TypeScript**：`strict`、`allowImportingTsExtensions`、`noUnusedLocals/Parameters`、別名 `@/* → ./src/*`。
- **Prettier**：semi + singleQuote + trailingComma es5 + tailwindcss plugin。
- **Commit 風格**（git log 觀察）：`feat:`、`fix:`、`chore:`、`style:` 前綴 + 中英文混合；feature PR 多由 `feature/*` 分支合進 `dev`。`main / uat / dev` 三軌存在。
- **沒有自動化測試套件**（package.json 無 test script、無 `*.test.*` 檔）；改動需要靠 type check (`npm run tsc`) + 手動驗證。
- **函式式工具**：`lib/functional.ts` 提供 `pipe / compose / throttle / debounce / memoize` 等，已用於 ImageCropper zoom 節流、`useAuthPipe`。`docs/functional-programming.md` 內列出建議寫法 — **新增複雜行為時優先組合既有工具，不要再寫一個版本**。

---

## 12. 你（接手者 / AI）最常需要的判斷

> 下面是預設給未來工程師 / AI 模型用來定位「新工作該寫在哪」的速查表。

| 任務 | 該動的檔案 | 注意事項 |
|---|---|---|
| 新增頁面 | `src/app/<route>/page.tsx`、必要時 `client.tsx` 拆 RSC/CSR | 別忘 `StaticRoutes`、`useStrictNavigateNext` 加導航方法、`systemRoutes` 避免被 `[userCode]` 吃掉 |
| 新 API endpoint（首選新方式） | `src/api/schemas/<name>.ts` → `src/api/contracts/<name>.ts` → `src/api/query/<name>.ts` → `src/hooks/api/<name>/{keys.ts,useXxx.ts}` | `axiosFetcher` 已支援 ts-rest；Response 一律走 `createResponseSchema` |
| 新 API endpoint（沿用舊風格） | `constants/apiPath.ts` 補路徑、`constants/queryKeys.ts` 補 key、`hooks/queries/useXxx.ts` 或 `hooks/mutations/useXxx.ts` | 401 已由 axios 攔截器處理，不要重複 |
| 新增 mutation 帶樂觀更新 | 參考 `useLikeAction` / `useFollowAction` + `optimisticUpdateHandler` | 共享 `debounceMap`、`shouldAllow` 注入 auth |
| 新 Drawer | 在 `constants/Drawer/index.ts` 加 `DrawerIds`、在頁面或 `ClientProviders` 使用 `<DrawerComponent drawerId=...>`，透過 `useDrawer(id)` 控制 | 全域 drawer（跨頁需保留）放 `ClientProviders` |
| 全螢幕「Fake Page」 | `FakePageType` 加 union、`FakePagePayloadMap` 加對應 payload、`openFakePage('xxx', payload)` | 別在頁面用 `useState` 自己刻 |
| 新 Form | 用 `react-hook-form` + zod schema（放 `types/common.ts`）+ `useFormErrorHandler` | Draft 用 `useIdle({ watch })` + LocalStorage |
| 切換 / 新增語言 | `Language` enum、`lingui.config.js` `locales`、`src/locales/<locale>/messages.po` | `WatchLocale` 已處理 key reset |
| 改變 LocalStorage 結構 | 更新 `STORAGE_VERSION`（= package.json 版本）+ 必要時在 `checkAndMigrateStorage` 加遷移程式 | 版本不符會直接 `localStorage.clear()` |
| 與後端跨網域 | 同時修改 `netlify.toml` CSP（`connect-src`）、`next.config.mjs` `images.remotePatterns`、`abort whitelist`（若不希望被取消） | 三處都漏會在 prod 失敗或顯示破圖 |
| 新增 Auth 受保護的動作 | 包 `useAuthWrapper({...}).withAuth(fn)` 或 `useAuthProtect().protect(fn)` | 未登入會自動 `setIsLoginDrawerOpen(true)` |
| 寫共用 util | 純函式 → `src/lib/`；含 hook 邏輯 → `src/hooks/`；含 React tree state → `src/components/<Name>/` Provider | 元件規約見 `components/README.md` |
| Mock 圖片 / 上傳 | `ImageUploader` + `ImageCropper`（react-easy-crop，throttle 30ms） | 影像最小 150×150；輸出為 base64 dataURL。**【未來】** 改為先上傳圖片給 BE 取得 URL，再把 URL 連同其他資料一起送出（見 §10 安全重點） |

---

## 13. 已知債務 / 進行中的遷移

從 commits 與 TODO 註解觀察到的尚未完成項目：

- **API 雙軌**：`hooks/api/*`（ts-rest + zod）與 `hooks/queries/*` + `hooks/mutations/*`（axios 直接）共存；mutation 尚未全面遷移。
- **route migration**：目前路由以 bare `<userCode>`（無 `@`）為主，`migrateUserRoute` 做向後兼容。**【未來規劃】** 將回歸使用 `@<userCode>` 前綴（例如 `/@john/list/1`），屆時需更新 `useStrictNavigateNext`、`migrateUserRoute`、`StaticRoutes`、`systemRoutes`，以及後端所有相關連結。
- **legacy components**：未對齊 `components/README.md` 規範者被視為 legacy（README 已標註「由 Sail 處理但尚未重組」）。具體清單如下：
  - `src/app/user/_components/FollowRelationsDrawer.tsx`：扁平 .tsx 檔，應改為 `FollowRelationsDrawer/index.tsx`
  - `src/app/user/_components/UserConnectionRow.tsx`：同上，應改為 `UserConnectionRow/index.tsx`
  - `src/app/settings/_components/ButtonRadioGroup.tsx`：同上，應改為 `ButtonRadioGroup/index.tsx`
  - `src/app/_shared/_components/List/Header/` 與 `src/app/[userCode]/list/_components/Header/`：兩個功能類似的 Header 元件，應合併
  - `src/components/Drawer/LoginDrawer.tsx`、`CreateListOrIdeaDrawer.tsx`、`HeaderDrawer.tsx`：全域 Drawer 的子元件以扁平 .tsx 命名，可考慮改為各自的 `<Name>/index.tsx` 子資料夾（低優先）
  - `src/components/Drawer/`、`src/components/FakePage/`、`src/components/Language/`：Provider 性質元件，README 已標註未來應遷移至 `src/providers/` 或 `src/contexts/`
- **Provider 位置**：`Drawer / FakePage / Language` 目前在 `components/`，README 註記未來會搬到 `providers/` 或 `contexts/`。
- **Pages Router 殘骸**：README 仍提到 Pages Router 遷移；目前 `src/` 已純 App Router，可清理舊文檔。
- **`useScrollPosition` 與 sessionStorage 滾動還原**：`useScrollPosition` hook（`src/hooks/useScrollPosition.ts`）已提供完整的 save / restore / clear 機制，以 `keyPrefix_pathname` 作為 key。**現況問題**：`src/components/Header/index.tsx` 與 `BackToUserHeader.tsx` 直接呼叫 `sessionStorage.removeItem('scroll_pos_/discovery')`（硬編字串），而非透過 hook 的 `clearScrollPosition`，導致若 keyPrefix 日後變更將造成遺留 key。**架構不需大改**，僅需把 Header 元件改用 hook 回傳的 `clearScrollPosition`，或將 key 建構邏輯匯出為共用 util，即可解決。Discovery ListSection 的 `SESSION_VISITED_KEY`（是否曾訪問的 flag）是獨立用途，不在此問題範圍內。
- **HTTP 狀態碼提示文案**：**【✅ 已實作 — commit `3d3db3e`】** 設計稿見 [`docs/superpowers/specs/2026-06-02-axios-status-code-management-design.md`](superpowers/specs/2026-06-02-axios-status-code-management-design.md)。狀態碼相關的「是否彈 toast / 彈什麼文案」已收斂到 axios response 攔截器：per-(API + 狀態碼) 靜默白名單（中央 registry + regex matcher）+ 狀態碼文案表 + fallback 三段決策；401 獨立優先處理不可被白名單繞過；2xx 一律不彈 toast。
- **ts-rest mutation 接線（進行中）**：新 ts-rest hook（`usePostNewIdea` / `usePostNewList` / `useDeleteList` 等）已建立並驗證可編譯，但部分消費端仍使用舊的 `hooks/mutations/*`（例：`ListCard` 仍用舊 `useDeleteList`）。待辦：逐一把消費端切到 `hooks/api/*` 的新 hook，再刪除 `hooks/mutations/` 對應舊檔。完成後才能進行下方「清舊 `QueryKeys.*`」。
- **✅ 點擊型社交動作 race condition**（Like / Follow）— **已於 commit `4bc46a9` 解決**：
  - **原問題**：debounce 期間連點 Like→Unlike（或 Follow→Unfollow），會以「toggle 前的 optimistic 值」決定送哪個 API，導致對未曾 Like / Follow 的目標送出 Unlike / Unfollow → 後端回錯。
  - **修法**：`useLikeStore` / `useFollowingStore` 新增 `confirmedIsLiked` / `confirmedIsFollowing` 狀態，每次 mutation `onSuccess` 寫入；`useLikeAction` / `useFollowAction` 的 debounce flush 前比對 `optimisticValue === confirmedValue`，相同則跳過 API；不同才依 `optimisticValue` 選擇 `(un)follow` / `(un)like` mutation 發送。
  - **保留紀錄供未來類似 optimistic + debounce 場景參考**。
- **`prop-types`**：依然在 dependencies，但 TS 接管後僅留作 transitive — 可考慮移除。
- **Storybook**：尚未引入，元件文件靠 README + 程式碼。
- **測試**：完全缺失（沒有 unit / e2e 套件設定）。
- **ts-rest mutation 遷移（進行中）**：`usePostNewIdea`（`src/hooks/api/ideas/usePostNewIdea.ts`）為第一支 ts-rest mutation 範本，`onSuccess` 內以 `setQueryData<InfiniteCache<...>>` 主動更新 `listsKeys.infiniteIdeas` 快取。後續待辦：
  - **POST/PUT/DELETE contract 補齊**：✅ 已完成 — post/delete/put idea（`usePostNewIdea` / `useDeleteIdea` / `usePutIdea`）、post/delete list（`usePostNewList` / `useDeleteList`）、edit list（`useEditList`，commit `756c640`）。**剩 `useReorderIdeas`（reorder contract）** 尚未遷 ts-rest；遷完即可全面接線 + 清舊 mutation。
  - **快取更新 helper 抽離（🔴 最迫切）**：`usePostNewIdea` / `usePostNewList` / `useDeleteList` / `usePutIdea` 已累積**四份** `setQueryData` 樣板，橫跨兩種 cache 型別（`InfiniteCache<...>` 的 list 無限捲、`TsRestCacheEntry<...>` 的單筆 entry）。應抽兩支共用 helper（`updateInfiniteCacheContent(queryClient, key, updater)` + `updateEntryCacheContent(queryClient, key, updater)`），封裝不可變展開邏輯，避免每支 mutation 重寫 immutability 樣板、杜絕直接 mutate cache object 的反模式。每多寫一支 ts-rest mutation 此債務就擴大一次，建議在繼續 `useEditList` / `useReorderIdeas` 之前先抽。
  - **`updatedAt` 由後端值取代**：`usePostNewIdea` 目前前端手拼 `YYYY-MM-DD HH:mm:ss.ffffff +0000 UTC` 字串塞進快取，格式脆弱。應改用 POST response 回傳的 `updatedAt`，或於 schema 標註此欄非必須。
  - **ts-rest mutation `onError` 型別對齊**：`UsePostNewIdeaOptions.onError` 目前用 `TsRestCacheEntry<unknown>`，與 ts-rest hook 真實 error 型別不符。新的 `usePostNewList` 已改用正確的 `ErrorResponse<typeof listsContract.postListsContract>`（`@ts-rest/react-query`），應反向套回 `usePostNewIdea` 並作為後續所有 ts-rest mutation 的統一模式（與「HTTP 狀態碼提示文案」待辦連動）。
  - **POST `/lists` response 缺 `coverImage`**：`listsSchema.postResponse` 由 `ListFormSchema.omit({ coverImage }).extend({ id })` 定義，但 `getUserLists` 的 content item（`listPreviewSchema`）含 `coverImage`。導致 `usePostNewList` 無法直接把 POST 回應 prepend 進 `userLists` 快取（型別不符 + UI 缺封面圖）。需後端於 POST 回應補 `coverImage`，或前端 prepend 時補 fallback，待定案。

---

## 14. 開發者 Onboarding 清單

1. 安裝 Node v22.15.1（建議 `nvm install 22.15.1 && nvm use`）。
2. 建立 `.env.local`，至少填 `NEXT_PUBLIC_API_BASE_URL`、`NEXT_PUBLIC_GOOGLE_CLIENT_ID`、`NEXT_PUBLIC_SITE_URL`。
3. `npm i`。
4. `npm run dev`（=`lingui extract && lingui compile && next dev -p 8080`）。
5. 在瀏覽器以 mobile user-agent 開啟（Chrome DevTools → Device Toolbar → iPhone）；否則會被 `ConditionalLayout` 導去 `/goToMobile`。
6. 開 React Query Devtools 觀察 query key 行為（左下角 logo）。
7. 改動 i18n 字串後跑 `npm run build-lang` 重新編譯 catalog。
8. 提交前 `npm run tsc` + `npm run lint` + `npm run format`。

---

## 15. 給 AI 模型的提示（Conventions Cheatsheet）

當你被要求「在此 repo 加功能 / 改 bug」時，請預設遵守下列規約，能大幅減少 review 摩擦：

- **永遠**使用 `@/` 絕對路徑 import，**不要**用相對路徑進出資料夾。
- **永遠**透過 `useStrictNavigateNext` 導航，不要 `router.push` / `<Link>` 直連動態路由（`<Link>` 可用於純 static href）。
- **永遠**使用 `t` / `<Trans>` 包覆使用者可見字串，**不要**留中英硬編字串在 JSX/錯誤訊息。
- **永遠**先檢查 `constants/queryKeys.ts` 或 `hooks/api/<resource>/keys.ts` 是否已有對應 key 再新增。
- **`localStorage.getItem` 只允許用在一個地方**：`src/lib/storage.ts` 的 `checkAndMigrateStorage` 做 `STORAGE_VERSION` 比對。其他任何地方必須使用 `getLocalStorage / setLocalStorage / removeLocalStorage`（`src/lib/utils.ts`）搭配 zod schema，以確保 runtime 型別安全，防止讀取到格式損壞的資料。
- **不要**在 mutation onError 內手刻 toast，axios 攔截器已彈過一次；除非要客製化文案，否則只處理 rollback。
- **不要**對 401 自行處理跳轉；axios 攔截器已自動 logout + redirect。
- 元件外觀差異請走 `class-variance-authority` 變體 + `cn(...)`，避免一堆三元 className。
- 「需要登入才能執行的事件」一律包 `withAuth(...)` 或 `protect(...)`；不要自己讀 `isLoggedIn` 比對。
- 增加 fetch 時若是非同步 race condition（例如連續點擊），先看 `useLikeAction` 是否能直接複用。
- 改動 LocalStorage 結構時更新 `STORAGE_VERSION`（`src/lib/storage.ts`）；目前需手動同步 `package.json` version，未來將自動化（見 §5 LocalStorage 說明）。
- 不要打開 service worker / PWA / RSC mutation 等與既有架構衝突的 Next 14 功能，除非有明確需求並更新此文件。

---

維護紀錄：本檔以 2026-05 時點的 `dev` 分支（HEAD `4fbe01b`）為快照產生。若日後架構大幅變動，請以 PR 更新本文件對應段落，避免被當作可信來源誤導後續工程師或 AI。
