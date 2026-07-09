# Relist 專案接管手冊 (Architecture & Handover)

> 對象：未曾接觸本 repo 的工程師或 AI 模型。
> 目標：在不需要逐檔閱讀的情況下，能正確判斷「該把新功能寫在哪、為什麼這樣寫、地雷在哪」。
> 補充閱讀：
>
> - `docs/functional-programming.md`：FP 工具與 `useAuth*` 高階 hook
> - `src/components/README.md`、`src/components/ui/README.md`：元件層級規約
> - `src/components/Drawer/README.md`、`src/providers/README.md`：Provider 規範
> - `docs/superpowers/specs/`：設計定案（axios 狀態碼管理等）；`docs/superpowers/plans/`：可執行重構計劃

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
├── api/                  # API 層：ts-rest contracts + zod schemas + react-query 整合
│   ├── axios.ts          # axios 實例 + interceptors（auth 注入 / abort 追蹤 / 狀態碼 toast 決策，見 §4.3）
│   ├── fetcher.ts        # ts-rest 用 axiosFetcher：非 2xx 轉 ts-rest error result + buildHeaders
│   │                      # 並導出快取型別 TsRestCacheEntry / TanStackCache / InfiniteCache（見 §4.5）
│   ├── whitelist.ts      # ABORT_WHITELIST（不可被 abortAll 取消）+ STATUS_WHITELIST（特定 API+狀態碼靜默不彈 toast）
│   │                      # 兩者皆為 { method, pattern: RegExp } regex matcher，支援動態 path
│   ├── contracts/        # ts-rest AppRoute 定義
│   ├── schemas/          # zod schemas（同時導出 request / response；所有 id 為 z.string()）
│   └── query/            # 由 contracts 派生的 react-query client (`initQueryClient`)
├── hooks/
│   ├── api/              # **標準** API hooks（query + mutation 皆在此）：包 `xxxQuery.method.useQuery/useMutation`
│   │   │                  # categories / discovery / follow / followers / followings / ideas / lists / unfollow / users
│   │   └── utils.ts      # updateEntryCaches / updateInfiniteCaches：mutation onSuccess 快取更新共用 helper（見 §4.5）
│   ├── queries/          # 【死碼】舊版 axios query hooks，已**零引用**，待刪（見 §13）
│   │   └── infinite/     # 同上，零引用
│   ├── mutations/        # 大多為死碼（零引用待刪，見 §13）；仍在使用的只有：
│   │   ├── useLikeAction.ts / useFollowAction.ts   # 點擊型社交動作編排（樂觀更新 + 防抖，見 §4.4）
│   │   └── optimisticUpdateHandler.ts              # 共用工廠：delta + rollback
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

### 4.2 API 層：ts-rest contract-first（遷移已實質完成）

ts-rest 遷移在 **consumer 層已完成**：`hooks/queries/*` 全部與 `hooks/mutations/*` 的純 API hooks 已**零引用**，僅剩檔案未刪（見 §13）。所有新工作一律走標準鏈：

```
src/api/schemas/<name>.ts     # zod schema（createResponseSchema 包 response；id 一律 z.string()）
  → src/api/contracts/<name>.ts   # AppRoute（method/path/query/body/responses）
  → src/api/query/<name>.ts       # initQueryClient(router, { api: axiosFetcher }) + 導出 Request/Response 型別
  → src/hooks/api/<name>/keys.ts  # query key factory
  → src/hooks/api/<name>/useXxx.ts # useQuery / useMutation hook
```

| 維度 | 規約 |
|---|---|
| 請求 | `xxxQuery.method.useQuery / useMutation`，底層 `axiosFetcher` |
| 驗證 | zod schema，runtime 安全；預設值用 `.default(...)` |
| Query Key | `xxxKeys.xxx(id)`（`hooks/api/<resource>/keys.ts`）；舊 `constants/queryKeys.ts` 僅剩死碼引用 |
| 錯誤型別 | `ErrorResponse<typeof contract>`（`@ts-rest/react-query`）— fetcher 已把非 2xx 轉為 ts-rest result，此型別是**真實的**（見 §4.5） |
| 成功型別 | `ClientInferResponseBody<typeof contract, 200>` 或 query/ 導出的 `XxxResponse['content']` |

唯二例外（非純 API hook，編排層）：`useLikeAction` / `useFollowAction`（§4.4）。

### 4.3 共用網路機制（[src/api/axios.ts](src/api/axios.ts)）

- 請求攔截：
  - 自動建立 `AbortController` 並 `track(controller, '<METHOD> <path>')` 到 [src/lib/abortManager.ts](src/lib/abortManager.ts)（白名單 [src/api/whitelist.ts](src/api/whitelist.ts) 排除）。
  - 注入 `Authorization: Bearer <accessToken>`，token 來自 `useAuthStore.getState().accessToken`。
  - ⚠️ 已知 bug：request error handler 內呼叫 `useStrictNavigationAdapter()` 屬非法 hook 呼叫（攔截器非 React 環境），見 §13。
- 回應攔截（狀態碼管理，設計稿見 [`docs/superpowers/specs/2026-06-02-axios-status-code-management-design.md`](superpowers/specs/2026-06-02-axios-status-code-management-design.md)），決策順序固定：
  1. **2xx**：一律不彈 toast；開發環境遇非 200 的 2xx 會 `console.warn`。
  2. **CanceledError**：跳過（`isDebug: true` 時 warn）。
  3. **401（獨立優先，不可被白名單繞過）**：toast `StatusErrorMessageI18n[401]` → `logout()` → `window.location.href = '/'`（清空 zustand persist）。
  4. **`isStatusWhitelist(method, path, status)`**：命中 `STATUS_WHITELIST`（regex matcher）→ 靜默 reject，交由呼叫端自行處理。
  5. **文案表**：`StatusErrorMessageI18n[status]`（[src/constants/i18n.ts](src/constants/i18n.ts)，`msg` 惰性 descriptor + `i18n._()`）有對應就彈。
  6. **fallback**：`錯誤${status}，請聯繫客服。`；無 response（網路錯誤）則彈 `StatusErrorMessageI18n[500]`。

**全域取消**：`abortAll()` / `abortKey()` 可用於頁面切換時批次取消未完成請求。若有 race-sensitive API（例如登入後立刻打 /me），請加入 `ABORT_WHITELIST`，否則可能在路由切換時被殺。`ABORT_WHITELIST` 與 `STATUS_WHITELIST` 同檔同型（`{ method, pattern: RegExp }`），新增規則時注意 pattern 對 query string 前的 path 比對。

### 4.4 樂觀更新 + 防抖模板

`useLikeAction` / `useFollowAction` 是兩個範本，模式為：

1. 全模組共享 `debounceMap: Map<string, Timeout>`，key 用 `like-<listID>` / `follow-<target.userCode>`（**key 必須含 target**，否則列表場景連點不同對象會互砍 timer）。
2. 點擊 → 先呼叫 `createOptimisticUpdateHandler(delta, targetUserID, updateCache).optimisticUpdate()`（更新 zustand + react-query cache）；失敗時 `rollback()` 套反向。**正反向必須對稱** — 若樂觀路徑沒套 cache 更新，rollback 也不可套，否則錯誤時 cache 被反向汙染。
3. `setTimeout` 到期時先比對 confirmed 基準：**僅在「`hasConfirmedFollowingState` 確實有紀錄且 `optimisticValue === confirmedValue`」時才跳過 API**；沒有紀錄一律送出（防 unfollow 靜默失敗）。confirmed 值由 mutation `onSuccess` 寫入（`setConfirmedIsLiked` / `setConfirmedIsFollowing`）。
4. `shouldAllow` / `onNotAllowed` 由呼叫端注入；常見組合：`shouldAllow: () => isLoggedIn`、`onNotAllowed: handleAuthRequired`（[useAuthRequired](src/hooks/useAuthRequired.ts) 會打開 LoginDrawer + toast）。
5. `useFollowAction` 為 **per-target instance**：`target: { userID, userCode }` 於 hook init 綁定，`follow()` / `unfollow()` 無參數；API call 委派給 `usePostFollowUser` / `usePostUnfollowUser`（ts-rest），編排層只負責樂觀更新 + 防抖 + rollback 接線。
6. **模組化已完成（2026-06 執行）**，目錄結構：
   - `mutations/optimistic/`：共用基礎設施 — `optimisticUpdateHandler.ts`（delta + rollback 工廠）、`debounceRegistry.ts`（`createDebounceRegistry(prefix)` factory，per-動作類型隔離 Map）
   - `mutations/followUnfollow/`：`schema.ts`（zod 型別）/ `followDebounce.ts` / `useFollowListCachesUpdate.ts` / `useFollowCountCachesUpdate.ts` / `useFollowAction.ts`（組裝層，~128 行）— 3 個 consumer 已接線
   - `mutations/optimistic/likeUnlike/`：`schema.ts` / `useLikeAction.ts` — **已建但未接線**（`client.tsx` 仍用舊檔，見 §13）

未來新增「點擊型社交動作」時請沿用此模式而非重寫 mutation。

### 4.5 ts-rest mutation 標準模式（必讀）

所有 `hooks/api/**/use{Post,Put,Delete}*.ts` 遵守同一形狀，新 mutation 照抄：

```ts
interface UseXxxOptions {
  onSuccess?: (data: XxxResponse['content']) => void;            // 傳 content，不傳整個 body
  onError?: (error: ErrorResponse<typeof contract>, request?: XxxRequest) => void;
}

export const useXxx = (options: UseXxxOptions) => {
  const queryClient = useQueryClient();
  return xxxQuery.method.useMutation({
    onSuccess: (response) => {
      const data = response.body.content;
      try {
        // 快取更新一律走 utils，不手寫 setQueryData 樣板
        updateEntryCaches<typeof contract>(queryClient, keys.xxx(id), (previousBody) => ({...}));
        updateInfiniteCaches<typeof contract>(queryClient, keys.infinite(id), (previousPages) => [...]);
      } catch (error) {
        console.warn('Refetch failed, but xxx succeeded:', error);  // 快取失敗不影響成功回報
      } finally {
        options.onSuccess?.(data);
      }
    },
    onError: (error, request) => options.onError?.(error, request.query ?? request.params),
  });
};
```

關鍵約定：

- **`hooks/api/utils.ts`**：`updateEntryCaches`（單筆 entry，updater 收 `body` 回 `body`）/ `updateInfiniteCaches`（無限捲，updater 收 `pages[]` 回 `pages[]`）。包裝層負責解開 / 包回與 `!caches` 早退，updater 只寫領域邏輯，**必須 immutable spread**，禁止就地 mutate cache 物件。
- **`src/api/fetcher.ts` 的錯誤轉換**：`axiosFetcher` 以 try/catch 把 axios 的非 2xx reject 轉成 `{ status, body, headers }` result 回傳 — 因此 ts-rest 能按 status 分流、`ErrorResponse<contract>` 型別真實可用。網路錯誤 / cancel 仍然 throw。
- **快取型別**：單筆 `TsRestCacheEntry<TBody>`、無限捲 `InfiniteCache<TBody>`（= `InfiniteData<TsRestCacheEntry<TBody>, number>`），皆從 `@/api/fetcher` 導入。有 contract route 可用時優先 `ClientInferResponseBody` / `ErrorResponse`，只有 body 型別時才用 `TsRestCacheEntry`。
- **onError 不要 toast**：axios 攔截器已按 §4.3 流程彈過；hook 內只做 rollback / 呼叫端 callback。
- **無限捲快取與順序變更不相容**：offset 分頁下若 mutation 改變了整體排序（如 reorder），手動 cache surgery 救不了未 fetch 的部分 — 改用 `invalidateQueries`（可先把 pages 砍到第一頁再 invalidate，refetch 從 N 支降為 1 支）。`usePostIdeasReorder` 為範例。

### 4.6 發佈額度（publish limits）與命令式查詢模式

免註冊體驗的額度牆：List / Idea 建立數有上限，用罄時彈 `SignupDrawer`。三個關鍵模式：

- **`src/hooks/queries/useCheckCreateQuota.ts`**：條件式序列查詢 — List 額度 →（滿了才）userLists →（再）逐 List 的 Idea 額度。因為流程是「條件 + 序列 + 動態 N 支」，**不能用 reactive custom hooks**（Rules of Hooks），改用 ts-rest client 的 **`.fetchQuery(queryClient, queryKey, args)`** 命令式取值 — 與 `useQuery` 共用同一 cache/staleTime/去重。`checkCanCreate(targetListID?)`：帶 listID 走單 List 精準分支；不帶走通用分支（內含 `me.userCode` 空值守衛 — **`fetchQuery` 不受 hook 的 `enabled` 保護**，守衛必須自帶）。
- **動態 N 筆 reactive 查詢用 `useQueries`**：`ListSelectorFakePage` 對 payload.lists 逐一查 Idea 額度 → `publishQuery.getIdeasLimits.useQueries({ queries: lists.map(...) })`，頂層一次呼叫，內部展開 N 筆，與 fetchQuery 共用 cache。載入中 fallback 放行避免閃鎖。
- **Drawer 鎖定 + open-time 控制**：`DrawerComponent` 支援 `isCloseable`（擋 esc / 點外 / 下拉手勢 / onOpenChange 總閘門）；`openDrawer(options?: DrawerOpenOptions)` 可於**開啟時**決定該次鎖不鎖（provider 以 `Map<drawerId, options>` 存 per-open 設定，優先於元件 prop）。route 變更（`usePathname`）強制關閉所有 drawer — 鎖定 drawer 的合法逃生口是「回上一頁」。

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

- `_storage_version`：版本字串，與 `STORAGE_VERSION`（`src/lib/storage.ts`）比對，不合就 `localStorage.clear()` 並要求重登入。**【✅ 已自動同步】** `next.config.mjs` 於 build time 讀取 `package.json` 的 `version` 注入 `env.NEXT_PUBLIC_APP_VERSION`，`storage.ts` 以 zod（`/^\d+\.\d+\.\d+$/`）parse 後導出 — **只需改 `package.json` 版本**，兩處自動一致；格式不符會在啟動時直接 throw。
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
| 新 API endpoint | `src/api/schemas/<name>.ts` → `src/api/contracts/<name>.ts` → `src/api/query/<name>.ts` → `src/hooks/api/<name>/{keys.ts,useXxx.ts}` | 唯一合法路徑（舊 `hooks/queries`/`hooks/mutations` 是待刪死碼，**不要**模仿）；mutation 形狀照 §4.5 模板 |
| mutation onSuccess 更新快取 | `hooks/api/utils.ts` 的 `updateEntryCaches` / `updateInfiniteCaches` | updater 收 body / pages，immutable spread；不要手寫 `setQueryData` 樣板 |
| 新增 mutation 帶樂觀更新 | 參考 `useLikeAction` / `useFollowAction` + `optimisticUpdateHandler` | 共享 `debounceMap`（key 含 target）、`shouldAllow` 注入 auth、confirmed 比對防重複送（§4.4） |
| 特定 API 的特定狀態碼不彈 toast | `src/api/whitelist.ts` 的 `STATUS_WHITELIST` 加 `{ method, pattern, status }` | 401 不可白名單（攔截器獨立優先處理） |
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

- **legacy API hooks 死碼待刪（2026-07-03 更新盤點）**：`hooks/queries/` 已大致清完（剩 `infinite/useInfiniteLists.ts`，零引用待刪）。仍待刪的零引用檔：
  - `src/hooks/mutations/`：`useCreateIdea` / `useCreateList` / `useDeleteIdea` / `useDeleteList` / `useEditIdea` / `useEditList` / `useEditProfile` / `useReorderIdeas`（8 支）
  - `src/hooks/mutations/useFollowAction.ts`：**orphan** — followUnfollow/ 模組化後零引用，勿再維護（曾被順手改 import path，白做工），直接 `git rm`
  - `src/hooks/mutations/useLikeAction.ts`：**接線完成後刪**（likeUnlike 模組已建，`client.tsx` 尚未切換）
  - 刪除後連動清理：`constants/queryKeys.ts`、`constants/apiPath.ts` 中只剩死碼引用的項目；followUnfollow 內 legacy `[QueryKeys.USER, ...]` cache 雙寫段（讀者已刪，雙寫無意義）。
- **like/unlike 接線（🚨 最後一哩）**：ts-rest 全鏈（schemas/contracts/query/`hooks/api/like|unlike`）與 `mutations/optimistic/likeUnlike/useLikeAction.ts` 皆已完成，但 `client.tsx` 仍 import 舊 `mutations/useLikeAction` — 切換 + 刪兩支舊檔即收尾。計劃：[`docs/superpowers/plans/2026-06-12-refactor-use-like-action.md`](superpowers/plans/2026-06-12-refactor-use-like-action.md)。
- **`followUnfollow/schema.ts` 的 `||` 死碼 bug**：`onSuccess.args(followSchema...content || unfollowSchema...content)`、`onError.args(..., postFollowRequest || postUnfollowRequest)` — `||` 左操作數恆 truthy，右側永遠不參與（恰巧同型未爆）。應改 `z.union([...])` 或拆兩組型別。
- **axios request error handler 非法 hook 呼叫**：**【✅ 已修】** 改為 `window.location.href = '/'`。
- **useFollowAction 剩餘債**：
  - count 語義債：`followingCount` 更新對象在 HeroSection 場景（follow 頁面主人）語義上應為主人的 `followerCount`；`schema.ts` 已預留 `listOwner` optional 欄位但 `useFollowAction` 尚未消費（仍用 `currentUserID/currentUserCode`）— 半套，接完或先移除欄位。
  - rollback 在 unmount 後不保證執行：rollback 掛 hook-level onError，RQ v5 observer 隨元件 unmount 銷毀後可能不觸發；debounce 5 秒內離頁即可能命中。完整修法為 QueryClient `MutationCache` 全域 callback。
- **SignupDrawer dead prop**：`React.FC`（無 props 泛型）卻 destructure `{ isCloseable = false }`，`<SignupDrawer />` 從不傳值 — 現由 open-time `DrawerOpenOptions` 控制（§4.6），此 prop 僅剩 fallback 作用，宜改為 `React.FC<SignupDrawerProps>` 或移除 prop 收斂到單一控制點。
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
- **ts-rest mutation 接線**：**【✅ 已完成】** 所有消費端已切到 `hooks/api/*` 新 hook（含 follow/unfollow：`usePostFollowUser` / `usePostUnfollowUser`，由 `useFollowAction` 編排）。剩餘工作即上方「legacy API hooks 死碼待刪」。
- **✅ 點擊型社交動作 race condition**（Like / Follow）— **已於 commit `4bc46a9` 解決**：
  - **原問題**：debounce 期間連點 Like→Unlike（或 Follow→Unfollow），會以「toggle 前的 optimistic 值」決定送哪個 API，導致對未曾 Like / Follow 的目標送出 Unlike / Unfollow → 後端回錯。
  - **修法**：`useLikeStore` / `useFollowingStore` 新增 `confirmedIsLiked` / `confirmedIsFollowing` 狀態，每次 mutation `onSuccess` 寫入；`useLikeAction` / `useFollowAction` 的 debounce flush 前比對 `optimisticValue === confirmedValue`，相同則跳過 API；不同才依 `optimisticValue` 選擇 `(un)follow` / `(un)like` mutation 發送。
  - **保留紀錄供未來類似 optimistic + debounce 場景參考**。
- **`prop-types`**：依然在 dependencies，但 TS 接管後僅留作 transitive — 可考慮移除。
- **Storybook**：尚未引入，元件文件靠 README + 程式碼。
- **測試**：完全缺失（沒有 unit / e2e 套件設定）。
- **ts-rest mutation 遷移收尾紀錄**（細項狀態）：
  - **POST/PUT/DELETE contract**：✅ 全數完成，含 reorder（`usePostIdeasReorder`，快取策略 = `invalidateQueries`，理由見 §4.5「無限捲與順序變更不相容」）與 follow/unfollow（query param 形式 `POST /follow?userID=`）。
  - **快取更新 helper 抽離**：✅ 完成 — `hooks/api/utils.ts` 的 `updateEntryCaches` / `updateInfiniteCaches`（§4.5）。後續強化選項：泛型補 `TStatus extends keyof T['responses'] = 200`，防未來 contract 增加錯誤 response 定義時 updater 參數變 union。
  - **ts-rest mutation `onError` 型別對齊**：✅ 完成 — 全部統一 `ErrorResponse<typeof contract>`；且 `axiosFetcher` 的 try/catch 錯誤轉換讓此型別 runtime 真實（§4.5）。
  - **`updatedAt` 由後端值取代**：`usePostNewIdea` / `usePutIdea` 仍以 `toBackendTimestamp(new Date())` 前端手拼塞快取，格式脆弱。應改用 response 回傳的 `updatedAt`，或於 schema 標註此欄非必須。
  - **GET `/{userCode}/lists` response 缺 `totalElements`**：`getUserLists` 回應未含 `totalElements`，導致前端無法實作 `getNextPageParam` 判斷最後一頁，infinite scroll 方案（`useGetUserInfiniteLists`）暫時擱置，ListSection 維持 `limit: 99` 一次抓完。待後端補 `totalElements` 後，前端 `useGetInfiniteLists` + ListSection sentinel 捲動已有完整實作稿（2026-07-06 session），`usePostNewList`/`useDeleteList` 兩段 invalidate 也已備好（目前註解封存）。
  - **POST `/lists` response 缺 `coverImage`**：`listsSchema.postResponse` 由 `ListFormSchema.omit({ coverImage }).extend({ id })` 定義，但 `getUserLists` 的 content item（`listPreviewSchema`）含 `coverImage`。導致 `usePostNewList` prepend 進 `userLists` 快取時缺封面圖。需後端於 POST 回應補 `coverImage`，或前端 prepend 時補 fallback，待定案。
- **id 型別分岔**：`src/api/schemas/**` 所有 id 已統一 `z.string()`，但 `src/types/User/index.ts` 等 legacy type 仍是 `id: number`，邊界處散落 `String(...)` 轉換。legacy hooks 刪除後一併收斂 legacy types。

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
- **不要**在 mutation onError 內手刻 toast，axios 攔截器已按 §4.3 決策流程彈過；除非要客製化文案（此時用 `STATUS_WHITELIST` 靜默 + 呼叫端自行 toast），否則只處理 rollback。
- **不要**對 401 自行處理跳轉；axios 攔截器已自動 logout + redirect。
- **新 mutation hook 照 §4.5 模板**：`onSuccess` 傳 `content`、try/catch/finally、快取走 `updateEntryCaches` / `updateInfiniteCaches`、error 型別 `ErrorResponse<typeof contract>`。
- **不要**手寫 `setQueryData` immutable 樣板，也**不要**就地 mutate cache 物件（`page.body.totalElements++` 之類）— 一律走 utils。
- **順序變更類 mutation**（reorder 等）對無限捲快取用 `invalidateQueries`，不要嘗試手動 surgery（offset 分頁下未 fetch 部分救不了）。
- **不要**模仿 `hooks/queries/*`、`hooks/mutations/use{Create,Edit,Delete}*` 的寫法 — 它們是零引用的待刪死碼。
- 元件外觀差異請走 `class-variance-authority` 變體 + `cn(...)`，避免一堆三元 className。
- 「需要登入才能執行的事件」一律包 `withAuth(...)` 或 `protect(...)`；不要自己讀 `isLoggedIn` 比對。
- 增加 fetch 時若是非同步 race condition（例如連續點擊），先看 `useLikeAction` 是否能直接複用。
- 改動 LocalStorage 結構時只需更新 `package.json` 的 `version` — `STORAGE_VERSION` 由 `next.config.mjs` 自動注入同步（見 §5 LocalStorage 說明）。
- 不要打開 service worker / PWA / RSC mutation 等與既有架構衝突的 Next 14 功能，除非有明確需求並更新此文件。

---

維護紀錄：

- 2026-05：以 `dev` 分支（HEAD `4fbe01b`）為快照初版。
- 2026-06-11：深度盤點更新 — ts-rest 遷移 consumer 層完成（§4.2）、axios 狀態碼管理實作落地（§4.3）、新增 §4.5 mutation 標準模式（fetcher 錯誤轉換 / cache utils / 快取型別）、STORAGE_VERSION 自動同步完成（§5）、§13 重整（legacy 死碼盤點清單、axios 非法 hook 呼叫、useFollowAction 債務與重構計劃連結）。
- 2026-07-03：`feature/free-demo` 期間更新 — §4.4 標記 followUnfollow 模組化完成（optimistic/ 共用 infra + likeUnlike 待接線）、新增 §4.6 發佈額度模式（fetchQuery 命令式查詢 / useQueries 動態 N 筆 / Drawer open-time 鎖定）、§13 更新盤點（queries/ 死碼已清、axios hook bug 已修、schema `||` bug、like 接線最後一哩、SignupDrawer dead prop）。工作交接紀錄見 `docs/handoff/`。

若日後架構大幅變動，請以 PR 更新本文件對應段落，避免被當作可信來源誤導後續工程師或 AI。
