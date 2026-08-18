# 測試基礎建設 Implementation Plan（E2E → Unit）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為 Relist FE 建立自動化測試防線 —— 先以 Playwright E2E 取代現行 2 小時手測清單並鎖住 SSR hydration 身分汙染類 bug，再以 Vitest 補上純函式與契約層單元測試。

**Architecture:** 三層。(1) **本地 mock API server**（Node `http`，依 `Authorization` header 決定回傳匿名或已登入視角）取代真 BE，讓 SSR 與 client 兩端請求都可控 —— 這是重現 hydration 汙染的唯一方法，因為 `page.route()` 攔不到 Server Component 的 Node 端 fetch。(2) **Playwright E2E** 以 mobile device 模擬繞過 UA gate，以注入 localStorage 繞過 Google OAuth。(3) **Vitest** 測純函式、cache helper 與 zod 契約。80% 確定性測試打 mock server，5 條煙霧測試打真 dev BE。

**Tech Stack:** Playwright（`@playwright/test`）、Vitest + `@testing-library/react` + jsdom、Node 22 `node:http`、既有 zod schemas 作為 fixture 型別來源。

## Global Constraints

- 分支：`feature/test-infrastructure`，**自 `feature/ideas-endpoint-split`（`aa0fe82`）開出** —— `dev` 尚未含 ideas endpoint split，Task 7 / 11 依賴的 `useGetInfiniteIdeasUnderList.ts` 與 Task 5 / 17 依賴的 hydration `sanitized` strip 只存在於該分支
- Node：`.nvmrc` = 22 → 每個 shell 先 `export PATH="$HOME/.nvm/versions/node/v22.15.1/bin:$PATH"`
- **type check 一律** `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -v TS6305`（期望零輸出）。**不可**用 `npm run tsc`（root tsconfig 的 project references 會噴約 300 條 TS6305 蓋掉真錯誤）
- E2E 一律 mobile device project —— 非 mobile UA 會被 `ConditionalLayout` 導向 `/goToMobile`（[ConditionalLayout/index.tsx:38-51](../../src/components/ConditionalLayout/index.tsx)）
- **絕不**把真實 access token、Google 憑證或 `.env.local` 提交進 repo；一律走 CI secrets
- **絕不**自動化 Google 登入 UI —— Google 會擋，且必然 flaky
- 測試檔命名：E2E 為 `e2e/**/*.spec.ts`；Unit 為與被測檔同目錄的 `<name>.test.ts`
- 既有 `src/` 目錄規約（ARCHITECTURE.md §3 Component Folder Rules）不因測試而破例
- 每 task 完成後回填 `status` / `evidence`；五欄（stage/status/summary/evidence/next_action）缺一不可；Verification 與 Delivery 為獨立階段不可省略

---

## 測試帳號策略（Google 登入的處置）

登入鏈路（[useLogin.ts:22-45](../../src/hooks/useLogin.ts)）：

```
Google 回傳 credential(idToken)
  → FE POST /auth/google { idToken }
  → BE 回 { accessToken, user }
  → FE 寫 localStorage: auth-storage / user-storage
```

**關鍵事實：Google 只出現在第一步。** 我們永遠不需要驅動 Google 的 UI。

### 分層處置

| 層           | 佔比            | Token 來源                                                      | Google 參與                  |
| ------------ | --------------- | --------------------------------------------------------------- | ---------------------------- |
| **確定性層** | 80%（Task 5-7） | **假 token 字串**（如 `'e2e-fake-token'`）直接注入 localStorage | ❌ 完全不參與                |
| **煙霧層**   | 5 條（Task 8）  | 真 BE 簽發的 accessToken                                        | ❌ 不參與（見下方 A/B 方案） |

確定性層的 token 從不被驗證 —— mock server 只讀 `Authorization` header **是否存在**來決定回匿名或登入視角，不驗簽。所以這 80% 零 Google 依賴、零過期問題、CI 可跑。

### 煙霧層取得真 token — 三方案

| 方案                      | 做法                                                                                                              | CI 可用       | 建議                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------------------- |
| **A（推薦，需 BE 配合）** | BE 新增 `POST /auth/test-token`，以 shared secret header 換取固定 fixture 帳號的 accessToken，**僅 dev 環境啟用** | ✅            | **正式解**，向 BE 提出                    |
| **B（過渡，本計劃採用）** | 人工登入一次後把 accessToken 存成 CI secret `E2E_ACCESS_TOKEN`；缺此 secret 時煙霧層自動 skip                     | ⚠️ 需定期更換 | **本計劃實作此案**，A 到位後 5 行內切換   |
| **C（不採用）**           | Playwright 驅動 Google 登入頁                                                                                     | ❌            | Google 擋自動化 + CAPTCHA/2FA，必然 flaky |

方案 B 的過期風險由 Task 8 的 skip 機制吸收 —— token 失效時煙霧層變 skip 而非 red，不會擋住 PR；CI summary 會顯示 skip 數量提醒更換。

### 需要 BE / 維運配合的前置（煙霧層專用）

在 dev 環境準備一組固定 fixture，內容不得被日常開發改動：

| 項目                             | 用途                |
| -------------------------------- | ------------------- |
| 測試帳號 A（已登入身分）         | 煙霧層主體          |
| 測試帳號 B（被 A follow）        | 驗證 follow 狀態    |
| A 的 public list（≥ 41 則 idea） | 驗證分頁跨 3 頁以上 |
| A 的 private list                | 驗證權限            |

**若前置未就緒，Task 8 可標 `skipped` 先行，不阻擋 Task 1-7、9-16。**

---

## File Structure

```
playwright.config.ts              # E2E 設定：mobile 雙 project + webServer 起 app 與 mock server
vitest.config.ts                  # Unit 設定：jsdom + @/ alias
e2e/
├── mock-server/
│   ├── server.ts                 # Node http mock API，依 Authorization 分歧回應
│   ├── state.ts                  # 記憶體 fixture DB + reset
│   └── start.ts                  # CLI entry（webServer 呼叫）
├── fixtures/
│   ├── auth.ts                   # buildStorageState()：組 auth-storage / user-storage
│   └── users.ts                  # 測試用 user 常數
├── specs/
│   ├── config-sanity.spec.ts     # Playwright/mock server 接線自檢
│   ├── like-identity.spec.ts     # E1, E3, E4
│   ├── follow-identity.spec.ts   # E2
│   ├── private-list.spec.ts      # E7, E8
│   ├── ideas-pagination.spec.ts  # E5
│   └── ideas-crud.spec.ts        # E6
└── smoke/
    └── smoke.spec.ts             # 5 條真 BE 煙霧測試（無 secret 則 skip）
src/
├── lib/seo/fetchers.ts           # 修改：revalidate 改為環境變數驅動（可測性）
├── hooks/api/ideas/offset.ts     # 新增：抽出的 offset 計算純函式
├── hooks/api/ideas/offset.test.ts
├── hooks/api/utils.test.ts
├── api/whitelist.test.ts
├── api/schemas/contract.test.ts
├── hooks/queries/publish/quota.ts       # 新增：抽出的額度判斷純函式
└── hooks/queries/publish/quota.test.ts
.github/workflows/ci.yml          # tsc + lint + build + vitest + playwright
```

**檔案職責邊界**：mock server 三檔分離的理由 —— `state.ts` 是唯一可變狀態來源（測試間 reset 的對象），`server.ts` 是純路由對應，`start.ts` 只負責啟動；三者分開才能讓 unit 層日後直接 import `state.ts` 產生 fixture 而不啟動 server。

---

### Task 1: CI 基線（tsc + lint + build）

| 欄位        | 值                                                                                                                |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| stage       | ci-baseline                                                                                                       |
| status      | pending                                                                                                           |
| summary     | 專案目前 `.github/` 只有 PR template、零自動化。先把現有品質底線（tsc / lint / build）鎖進 CI，後續測試才有掛載點 |
| evidence    | 待填：workflow 檔內容 + 首次 PR 的 Actions 執行結果連結                                                           |
| next_action | Task 2                                                                                                            |

**Files:**

- Create: `.github/workflows/ci.yml`

**Interfaces:**

- Produces: `verify` job —— Task 9 與 Task 16 會在此檔追加 `e2e` / `unit` job
- Consumes: 無

- [ ] **Step 1: 建立 workflow**

建立 `.github/workflows/ci.yml`：

```yaml
name: CI

on:
  pull_request:
    branches: [dev, main]
  push:
    branches: [dev]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit -p tsconfig.app.json

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_BASE_URL: http://localhost:4000
          NEXT_PUBLIC_GOOGLE_CLIENT_ID: ci-placeholder-client-id
          NEXT_PUBLIC_SITE_URL: http://localhost:8080
```

註：`npm run build` 內含 `lingui extract && lingui compile`，locale 產物於 build 時生成，不需額外步驟。三個 `NEXT_PUBLIC_*` 為 build 時內嵌，CI 給佔位值即可（此 job 不跑實際請求）。

- [ ] **Step 2: 本機預演 CI 指令**

Run:

```bash
export PATH="$HOME/.nvm/versions/node/v22.15.1/bin:$PATH" && npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -v TS6305
```

Expected: 零輸出

Run:

```bash
export PATH="$HOME/.nvm/versions/node/v22.15.1/bin:$PATH" && npm run lint
```

Expected: 成功結束（若既有 lint 錯誤，**先修或在本 task 內加 `--max-warnings=<現況數>`，不可留紅**）

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add type check, lint and build workflow"
```

---

### Task 2: SEO fetch revalidate 可測化

| 欄位        | 值                                                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stage       | testability                                                                                                                                                               |
| status      | pending                                                                                                                                                                   |
| summary     | `fetchJSONForSEO` 硬編 `revalidate: 300`，會讓 E2E 的第二個測試吃到第一個測試的 SSR 快取回應，hydration 測試因此無法隔離。改為環境變數驅動，預設值不變（prod 行為零改動） |
| evidence    | 待填：diff + `SEO_FETCH_REVALIDATE=0` 下連續兩次請求得到不同回應的實測                                                                                                    |
| next_action | Task 3                                                                                                                                                                    |

**Files:**

- Modify: `src/lib/seo/fetchers.ts:9-21`

**Interfaces:**

- Produces: 讀取 `process.env.SEO_FETCH_REVALIDATE`（未設定時 fallback 300）；Task 4 的 `playwright.config.ts` 會設為 `0`
- Consumes: 無

- [ ] **Step 1: 改寫 fetchJSONForSEO**

`src/lib/seo/fetchers.ts`，把現有的 `fetchJSONForSEO` 替換為：

```ts
// E2E 需要關閉 SSR fetch 快取才能隔離測試（否則第二個測試吃到第一個的快取回應）。
// 未設定或格式不正確時維持 300 秒，prod 行為不變。
// 注意 `|| NaN`：空字串會讓 Number('') 得 0，須先落為 NaN 才會 fallback；
// 而 '0' 為 truthy，E2E 設 '0' 關閉快取的意圖得以保留。
const parsedRevalidate = Number(process.env.SEO_FETCH_REVALIDATE || NaN);
const SEO_FETCH_REVALIDATE =
  Number.isFinite(parsedRevalidate) && parsedRevalidate >= 0
    ? parsedRevalidate
    : 300;

export async function fetchJSONForSEO<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${baseURL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: SEO_FETCH_REVALIDATE },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch (error) {
    console.error(`Failed to fetch ${path} for SEO:`, error);
    return null;
  }
}
```

- [ ] **Step 2: type check**

Run: `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -v TS6305`
Expected: 零輸出

- [ ] **Step 3: Commit**

```bash
git add src/lib/seo/fetchers.ts
git commit -m "refactor: make SEO fetch revalidate configurable for tests"
```

---

### Task 3: 補 data-testid 並清除 role 濫用

| 欄位        | 值                                                                                                                                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| stage       | testability                                                                                                                                                                                                                                                  |
| status      | pending                                                                                                                                                                                                                                                      |
| summary     | 全專案 `data-testid` 為 0；現有 `role="hero"` / `role="list-preview"` / `role="links-block"` 皆非合法 ARIA role（被當 testid 濫用，傷 a11y）。補上首波 spec 需要的 testid，並以 `data-liked` / `data-following` 暴露狀態，讓斷言不依賴 i18n 文案或 CSS class |
| evidence    | 待填：diff + `grep -rn 'role="hero"\|role="list-preview"\|role="links-block"' src/` 為空                                                                                                                                                                     |
| next_action | Task 4                                                                                                                                                                                                                                                       |

**Files:**

- Modify: `src/components/Footer/FloatingButtonFooter.tsx`（like 按鈕）
- Modify: `src/components/Header/BackToUserHeader.tsx`（follow 按鈕，約 line 138-150）
- Modify: `src/app/[userCode]/list/[id]/_components/ListCard/_components/IdeaList/index.tsx`（idea row）
- Modify: `src/app/user/_components/ListSection/index.tsx`（list row + 根節點 role）
- Modify: `src/app/user/_components/HeroSection/index.tsx:208`（role → data-testid）
- Modify: `src/app/user/_components/HeroSection/HeroSectionSkeleton.tsx:8`（同上）
- Modify: `src/app/settings/_components/BlocksSection/LinksBlock/index.tsx:27`（同上）
- Modify: `src/app/user/_components/ListSection/ListSectionSkeleton.tsx:14`（同上）

**Interfaces:**

- Produces: 以下選擇器契約，Task 5-8 全數依賴 ——
  - `[data-testid="like-button"]`，帶 `data-liked="true" | "false"`
  - `[data-testid="follow-button"]`，帶 `data-following="true" | "false"`
  - `[data-testid="idea-row"]`，帶 `data-idea-id="<id>"`
  - `[data-testid="list-row"]`，帶 `data-list-id="<id>"`
  - `[data-testid="hero"]`、`[data-testid="list-preview"]`、`[data-testid="links-block"]`
- Consumes: 無

- [ ] **Step 1: like 按鈕**

`src/components/Footer/FloatingButtonFooter.tsx`，把 `hasLikeButton && (...)` 內的 `<Button>` 開頭屬性改為：

```tsx
          <Button
            data-testid="like-button"
            data-liked={isLiked === true}
            onClick={handleLike}
            variant={ButtonVariant.WHITE}
            className="flex items-center gap-1.5 text-sm"
          >
```

（`isLiked` 型別為 `boolean | undefined`；`=== true` 讓 undefined 落為 `false`，屬性永遠有明確值）

- [ ] **Step 2: follow 按鈕**

`src/components/Header/BackToUserHeader.tsx`，把 follow `<Button>` 開頭屬性改為：

```tsx
            <Button
              data-testid="follow-button"
              data-following={isFollowing === true}
              variant={
                isFollowing ? ButtonVariant.SUB_ACTIVE : ButtonVariant.BLACK
              }
              shape={ButtonShape.ROUNDED_FULL}
              size={ButtonSize.SM}
              onClick={handleFollowOrUnfollow}
            >
```

- [ ] **Step 3: idea row**

`src/app/[userCode]/list/[id]/_components/ListCard/_components/IdeaList/index.tsx`，在 map 產生的每列 idea 最外層 element 加上：

```tsx
              data-testid="idea-row"
              data-idea-id={idea.id}
```

- [ ] **Step 4: list row 與 role 清理**

`src/app/user/_components/ListSection/index.tsx`：

根節點 `<div role="list-preview" ...>` 改為 `<div data-testid="list-preview" ...>`；map 內每列最外層 `<div key={listPreview.id} ...>` 加上：

```tsx
              data-testid="list-row"
              data-list-id={listPreview.id}
```

- [ ] **Step 5: 其餘 role 濫用改名**

四處機械替換（`role="X"` → `data-testid="X"`）：

| 檔案                                                                 | 原                    | 改                           |
| -------------------------------------------------------------------- | --------------------- | ---------------------------- |
| `src/app/user/_components/ListSection/ListSectionSkeleton.tsx:14`    | `role="list-preview"` | `data-testid="list-preview"` |
| `src/app/user/_components/HeroSection/index.tsx:208`                 | `role="hero"`         | `data-testid="hero"`         |
| `src/app/user/_components/HeroSection/HeroSectionSkeleton.tsx:8`     | `role="hero"`         | `data-testid="hero"`         |
| `src/app/settings/_components/BlocksSection/LinksBlock/index.tsx:27` | `role="links-block"`  | `data-testid="links-block"`  |

- [ ] **Step 6: 確認無殘留 + 無其他程式碼依賴舊 role**

Run:

```bash
grep -rn 'role="hero"\|role="list-preview"\|role="links-block"' src/
```

Expected: 零輸出

Run:

```bash
grep -rn "getByRole('hero'\|getByRole('list-preview'\|querySelector('\[role=" src/
```

Expected: 零輸出（確認沒有程式碼靠舊 role 選取）

- [ ] **Step 7: type check + build**

Run: `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -v TS6305`
Expected: 零輸出

Run: `npm run build`
Expected: 成功，route table 與改動前一致

- [ ] **Step 8: Commit**

```bash
git add src/components/Footer/FloatingButtonFooter.tsx \
        src/components/Header/BackToUserHeader.tsx \
        "src/app/[userCode]/list/[id]/_components/ListCard/_components/IdeaList/index.tsx" \
        src/app/user/_components/ListSection/index.tsx \
        src/app/user/_components/ListSection/ListSectionSkeleton.tsx \
        src/app/user/_components/HeroSection/index.tsx \
        src/app/user/_components/HeroSection/HeroSectionSkeleton.tsx \
        src/app/settings/_components/BlocksSection/LinksBlock/index.tsx
git commit -m "test: add data-testid hooks and replace invalid ARIA roles"
```

---

### Task 4: Mock API server + Playwright 設定

| 欄位        | 值                                                                                                                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stage       | e2e-infra                                                                                                                                                                                                                                   |
| status      | pending                                                                                                                                                                                                                                     |
| summary     | 建立依 `Authorization` header 分歧回應的本地 mock API server，並設定 Playwright（mobile 雙 project + webServer 同時起 app 與 mock）。**SSR fetch 走 Node 端，`page.route()` 攔不到**，因此必須用真 HTTP mock server 才能控制 hydration 情境 |
| evidence    | 待填：`npx playwright test e2e/specs/config-sanity.spec.ts` 通過輸出                                                                                                                                                                        |
| next_action | Task 5                                                                                                                                                                                                                                      |

**Files:**

- Create: `e2e/mock-server/state.ts`
- Create: `e2e/mock-server/server.ts`
- Create: `e2e/mock-server/start.ts`
- Create: `e2e/fixtures/users.ts`
- Create: `e2e/fixtures/auth.ts`
- Create: `playwright.config.ts`
- Modify: `package.json`（scripts + devDependencies）
- Modify: `.gitignore`

**Interfaces:**

- Produces:
  - `resetState(): void` — 重置 mock DB
  - `getState(): MockState` — 讀取當前 mock DB
  - `buildStorageState(opts?: { token?: string }): StorageState` — Playwright storageState 物件
  - `TEST_USER_A` / `TEST_USER_B` — fixture user 常數
  - mock server 控制端點 `POST /__test__/reset`（唯一；不實作 seed —— 全部 spec 皆以 reset 回到固定 fixture，無自訂 seed 需求）
- Consumes: `src/api/schemas/**` 的回應形狀（手動對齊，不 import —— e2e 不納入 `tsconfig.app.json` 的 `include`）

- [ ] **Step 1: 安裝相依**

Run:

```bash
export PATH="$HOME/.nvm/versions/node/v22.15.1/bin:$PATH" && npm i -D @playwright/test tsx && npx playwright install --with-deps chromium webkit
```

Expected: 安裝成功，`package.json` devDependencies 出現 `@playwright/test` 與 `tsx`

- [ ] **Step 2: 建立 mock state**

建立 `e2e/mock-server/state.ts`：

```ts
export interface MockIdea {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
}

export interface MockList {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
  categoryID: number;
  type: number; // 0 = PUBLIC, 1 = PRIVATE
  likeCount: number;
  likedBy: Set<string>;
  createdAt: string;
  updatedAt: string;
  ownerUserCode: string;
  ideas: MockIdea[];
}

export interface MockUser {
  id: number;
  displayName: string;
  userCode: string;
  profileImage: string;
  listCount: number;
  followerCount: number;
  followingCount: number;
  followedBy: Set<string>;
}

export interface MockState {
  users: Map<string, MockUser>;
  lists: Map<string, MockList>;
}

const makeIdeas = (listID: string, count: number): MockIdea[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${listID}-idea-${i + 1}`,
    title: `Idea ${i + 1}`,
    description: `Description for idea ${i + 1}`,
    coverImage: '',
    externalLink: '',
  }));

const buildInitialState = (): MockState => {
  const users = new Map<string, MockUser>();
  users.set('usera', {
    id: 1,
    displayName: 'User A',
    userCode: 'usera',
    profileImage: '',
    listCount: 2,
    followerCount: 0,
    followingCount: 1,
    followedBy: new Set<string>(),
  });
  users.set('userb', {
    id: 2,
    displayName: 'User B',
    userCode: 'userb',
    profileImage: '',
    listCount: 0,
    followerCount: 1,
    followingCount: 0,
    followedBy: new Set<string>(['usera']),
  });

  const lists = new Map<string, MockList>();
  lists.set('100', {
    id: '100',
    title: 'Public List',
    description: 'A public list',
    coverImage: '',
    externalLink: '',
    categoryID: 1,
    type: 0,
    likeCount: 1,
    likedBy: new Set<string>(['usera']),
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ownerUserCode: 'usera',
    ideas: makeIdeas('100', 41),
  });
  lists.set('101', {
    id: '101',
    title: 'Private List',
    description: 'A private list',
    coverImage: '',
    externalLink: '',
    categoryID: 1,
    type: 1,
    likeCount: 0,
    likedBy: new Set<string>(),
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ownerUserCode: 'usera',
    ideas: makeIdeas('101', 3),
  });
  // userb 的 public list —— follow 按鈕只在「非自己的 list」顯示，
  // 所以 follow 汙染測試必須用別人的 list 才有按鈕可斷言。
  lists.set('102', {
    id: '102',
    title: 'User B List',
    description: "User B's public list",
    coverImage: '',
    externalLink: '',
    categoryID: 1,
    type: 0,
    likeCount: 0,
    likedBy: new Set<string>(),
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ownerUserCode: 'userb',
    ideas: makeIdeas('102', 2),
  });

  return { users, lists };
};

let state: MockState = buildInitialState();

export const getState = (): MockState => state;
export const resetState = (): void => {
  state = buildInitialState();
};
```

- [ ] **Step 3: 建立 mock server**

建立 `e2e/mock-server/server.ts`：

```ts
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { getState, MockList, resetState } from './state';

// 「已登入」= 帶 Authorization header。不驗簽 —— E2E 的假 token 只需存在即可。
// 這一分歧正是重現 SSR hydration 匿名汙染的關鍵：Server Component 不帶 token。
const viewerOf = (req: IncomingMessage): string | null =>
  req.headers.authorization ? 'usera' : null;

const ok = (res: ServerResponse, content: unknown, extra: object = {}) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });
  res.end(
    JSON.stringify({ code: '0000', message: 'success', content, ...extra })
  );
};

const fail = (res: ServerResponse, status: number) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({ code: String(status), message: 'error', content: null })
  );
};

const readBody = async (
  req: IncomingMessage
): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString()) as Record<
      string,
      unknown
    >;
  } catch {
    return {};
  }
};

const listPayload = (list: MockList, viewer: string | null) => ({
  id: list.id,
  title: list.title,
  description: list.description,
  coverImage: list.coverImage,
  externalLink: list.externalLink,
  categoryID: list.categoryID,
  type: list.type,
  likeCount: list.likeCount,
  // 匿名一律 false —— 這就是汙染源，測試要驗證它不會被 hydrate 進 client cache
  isLiked: viewer ? list.likedBy.has(viewer) : false,
  createdAt: list.createdAt,
  updatedAt: list.updatedAt,
  ideaTotalCount: list.ideas.length,
  owner: {
    id: getState().users.get(list.ownerUserCode)?.id ?? 0,
    displayName: getState().users.get(list.ownerUserCode)?.displayName ?? '',
    userCode: list.ownerUserCode,
    profileImage: '',
  },
});

export const createMockServer = () =>
  createServer((req, res) => {
    void handle(req, res);
  });

const handle = async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const path = url.pathname;
  const method = req.method ?? 'GET';
  const viewer = viewerOf(req);
  const state = getState();

  // --- 測試控制端點 ---
  if (path === '/__test__/reset' && method === 'POST') {
    resetState();
    return ok(res, null);
  }

  // --- GET /lists/:listID ---
  const listMatch = /^\/lists\/([^/]+)$/.exec(path);
  if (listMatch && method === 'GET') {
    const list = state.lists.get(listMatch[1]);
    if (!list) return fail(res, 404);
    // private list 對非擁有者回 403（匿名 SSR 也會拿到 403）
    if (list.type === 1 && viewer !== list.ownerUserCode) return fail(res, 403);

    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 3);
    return ok(
      res,
      {
        ...listPayload(list, viewer),
        ideas: list.ideas.slice(offset, offset + limit),
      },
      { offset, limit, totalElements: list.ideas.length }
    );
  }

  // --- GET /ideas?listID&offset&limit ---
  if (path === '/ideas' && method === 'GET') {
    const list = state.lists.get(url.searchParams.get('listID') ?? '');
    if (!list) return fail(res, 404);
    if (list.type === 1 && viewer !== list.ownerUserCode) return fail(res, 403);
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 20);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    });
    return res.end(
      JSON.stringify({
        ideas: list.ideas.slice(offset, offset + limit),
        ideaTotalCount: list.ideas.length,
      })
    );
  }

  // --- POST /ideas ---
  if (path === '/ideas' && method === 'POST') {
    if (!viewer) return fail(res, 401);
    const body = await readBody(req);
    const list = state.lists.get(String(body.listID));
    if (!list) return fail(res, 404);
    const idea = {
      id: `${list.id}-idea-new-${list.ideas.length + 1}`,
      title: String(body.title ?? ''),
      description: String(body.description ?? ''),
      coverImage: String(body.coverImage ?? ''),
      externalLink: String(body.externalLink ?? ''),
    };
    list.ideas.unshift(idea);
    return ok(res, { ...idea, listID: list.id });
  }

  // --- DELETE /ideas/:ideaID ---
  const ideaMatch = /^\/ideas\/([^/]+)$/.exec(path);
  if (ideaMatch && method === 'DELETE') {
    if (!viewer) return fail(res, 401);
    for (const list of state.lists.values()) {
      const index = list.ideas.findIndex((i) => i.id === ideaMatch[1]);
      if (index >= 0) {
        list.ideas.splice(index, 1);
        return ok(res, null);
      }
    }
    return fail(res, 404);
  }

  // --- POST /like, POST /unlike ---
  if ((path === '/like' || path === '/unlike') && method === 'POST') {
    if (!viewer) return fail(res, 401);
    const listID =
      url.searchParams.get('listID') ?? String((await readBody(req)).listID);
    const list = state.lists.get(listID);
    if (!list) return fail(res, 404);
    if (path === '/like' && !list.likedBy.has(viewer)) {
      list.likedBy.add(viewer);
      list.likeCount += 1;
    }
    if (path === '/unlike' && list.likedBy.has(viewer)) {
      list.likedBy.delete(viewer);
      list.likeCount -= 1;
    }
    return ok(res, null);
  }

  // --- POST /follow, POST /unfollow ---
  if ((path === '/follow' || path === '/unfollow') && method === 'POST') {
    if (!viewer) return fail(res, 401);
    const target = [...state.users.values()].find(
      (u) => String(u.id) === url.searchParams.get('userID')
    );
    if (!target) return fail(res, 404);
    if (path === '/follow') target.followedBy.add(viewer);
    else target.followedBy.delete(viewer);
    target.followerCount = target.followedBy.size;
    return ok(res, null);
  }

  // --- GET /publish/limits/lists, /publish/limits/ideas ---
  if (path.startsWith('/publish/limits/') && method === 'GET') {
    if (!viewer) return fail(res, 401);
    return ok(res, {
      usedCount: 2,
      limitCount: 10,
      remainingCount: 8,
      isUnlimited: false,
    });
  }

  // --- GET /:userCode/lists ---
  const userListsMatch = /^\/([^/]+)\/lists$/.exec(path);
  if (userListsMatch && method === 'GET') {
    const owner = userListsMatch[1];
    const all = [...state.lists.values()].filter(
      (l) => l.ownerUserCode === owner && (l.type === 0 || viewer === owner)
    );
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    return ok(
      res,
      all.slice(offset, offset + limit).map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        coverImage: l.coverImage,
        externalLink: l.externalLink,
        categoryID: l.categoryID,
        type: l.type,
      })),
      { offset, limit, totalElements: all.length }
    );
  }

  // --- GET /:userCode/info ---
  const infoMatch = /^\/([^/]+)\/info$/.exec(path);
  if (infoMatch && method === 'GET') {
    const user = state.users.get(infoMatch[1]);
    if (!user) return fail(res, 404);
    return ok(res, {
      id: user.id,
      displayName: user.displayName,
      userCode: user.userCode,
      profileImage: user.profileImage,
      listCount: user.listCount,
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      // 匿名一律 false —— follow 版的同款汙染源
      isFollowing: viewer ? user.followedBy.has(viewer) : false,
    });
  }

  return fail(res, 404);
};
```

- [ ] **Step 4: 建立啟動入口**

建立 `e2e/mock-server/start.ts`：

```ts
import { createMockServer } from './server';

const port = Number(process.env.MOCK_API_PORT ?? 4000);
createMockServer().listen(port, () => {
  console.log(`[mock-api] listening on http://localhost:${port}`);
});
```

- [ ] **Step 5: 建立 auth fixture**

建立 `e2e/fixtures/users.ts`：

```ts
export const TEST_USER_A = {
  id: 1,
  displayName: 'User A',
  userCode: 'usera',
  profileImage: '',
  listCount: 2,
} as const;

export const TEST_USER_B = {
  id: 2,
  displayName: 'User B',
  userCode: 'userb',
  profileImage: '',
  listCount: 0,
} as const;

export const FAKE_TOKEN = 'e2e-fake-token';
```

建立 `e2e/fixtures/auth.ts`：

```ts
import { FAKE_TOKEN, TEST_USER_A } from './users';

const APP_ORIGIN = process.env.E2E_BASE_URL ?? 'http://localhost:8080';

/**
 * 組出「已登入」的 Playwright storageState。
 * 形狀必須與 zustand persist 的序列化結果一致：{ state, version }。
 * 對應 useAuthStore（name: 'auth-storage'）與 useUserStore（name: 'user-storage'）。
 */
export const buildStorageState = (
  options: { token?: string; user?: typeof TEST_USER_A } = {}
) => {
  const token = options.token ?? FAKE_TOKEN;
  const user = options.user ?? TEST_USER_A;
  return {
    cookies: [],
    origins: [
      {
        origin: APP_ORIGIN,
        localStorage: [
          {
            name: 'auth-storage',
            value: JSON.stringify({
              state: { isLoggedIn: true, accessToken: token },
              version: 0,
            }),
          },
          {
            name: 'user-storage',
            value: JSON.stringify({ state: { me: user }, version: 0 }),
          },
        ],
      },
    ],
  };
};

/** 匿名狀態：完全空的 storage */
export const anonymousStorageState = { cookies: [], origins: [] };
```

- [ ] **Step 6: 建立 Playwright 設定**

建立 `playwright.config.ts`：

```ts
import { defineConfig, devices } from '@playwright/test';

const APP_PORT = 8080;
const MOCK_PORT = 4000;
const BASE_URL = `http://localhost:${APP_PORT}`;

export default defineConfig({
  testDir: './e2e',
  // Serialised on purpose: every worker shares ONE mock-server process on
  // port 4000 whose fixture state is a single module-level object
  // (e2e/mock-server/state.ts). Each test's beforeEach POSTs
  // /__test__/reset, which reassigns that shared object — with more than
  // one worker, a sibling test's in-flight requests can land against a
  // state object that was just reset out from under them. Per-worker state
  // isolation is not viable here: page navigations trigger Server
  // Component fetches from the Next.js server process, which cannot carry
  // a per-worker header, so browser-side and SSR-side requests could never
  // agree on which worker's state to use. Do NOT raise `workers` back up —
  // it will reintroduce intermittent failures once a spec performs a
  // successful mutation (e.g. deleting an idea).
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile-chrome',
      testIgnore: /smoke\//,
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      testIgnore: /smoke\//,
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'smoke',
      testMatch: /smoke\//,
      use: {
        ...devices['Pixel 7'],
        baseURL: process.env.E2E_SMOKE_BASE_URL ?? BASE_URL,
      },
    },
  ],
  webServer: [
    {
      command: 'npx tsx e2e/mock-server/start.ts',
      // 探活必須指向 GET 路由：Playwright 以 GET 輪詢，指向 POST-only 的
      // /__test__/reset 會每次 404 並在 60s 後 timeout（2026-08 實測）
      url: `http://localhost:${MOCK_PORT}/usera/info`,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
    },
    {
      // Build here (via `build:e2e`), not just start: SEO_FETCH_REVALIDATE affects
      // build-time prerendering, so building without it renders routes like
      // /[userCode]/list/[id] as static, then runtime (which does set
      // SEO_FETCH_REVALIDATE=0) forces dynamic rendering and Next throws
      // "Page changed from static to dynamic at runtime". Do not "optimise" this
      // back down to a separate pre-built `npm run start` — build and run must
      // share the same env.
      command: 'npm run build:e2e && npm run start',
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
      env: {
        NEXT_PUBLIC_API_BASE_URL: `http://localhost:${MOCK_PORT}`,
        NEXT_PUBLIC_SITE_URL: BASE_URL,
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'e2e-placeholder-client-id',
        SEO_FETCH_REVALIDATE: '0',
      },
    },
  ],
});
```

📌 `webServer.url` 對 mock server 必須指向 **GET** 路由。原先指向 `/__test__/reset`（POST-only）會讓 Playwright 的 GET 探活每次得 404 並在 60s 後 timeout —— 2026-08 實測確認，故改用 `/usera/info`。

- [ ] **Step 7: 加 npm scripts**

`package.json` 的 `scripts` 區塊追加四行：

```json
    "build:e2e": "SEO_FETCH_REVALIDATE=0 NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 NEXT_PUBLIC_SITE_URL=http://localhost:8080 NEXT_PUBLIC_GOOGLE_CLIENT_ID=e2e-placeholder-client-id npm run build",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "mock-api": "tsx e2e/mock-server/start.ts",
```

`build:e2e` 會透過既有的 `build` script（保留 Lingui extract/compile 步驟），並內嵌與 `webServer` 的 `npm run start` 完全相同的四個環境變數 —— 詳見下方風險備忘。

- [ ] **Step 8: 更新 .gitignore**

`.gitignore` 追加：

```
# Playwright
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

- [ ] **Step 9: 建立設定驗證測試**

建立 `e2e/specs/config-sanity.spec.ts`：

```ts
import { expect, test } from '@playwright/test';

test('app loads on mobile UA without redirecting to goToMobile', async ({
  page,
}) => {
  await page.goto('/discovery');
  await expect(page).not.toHaveURL(/goToMobile/);
});

test('mock api serves list payload', async ({ request }) => {
  const res = await request.get(
    'http://localhost:4000/lists/100?offset=0&limit=3'
  );
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.content.title).toBe('Public List');
  expect(body.totalElements).toBe(41);
});

test('mock api varies isLiked by Authorization header', async ({ request }) => {
  const anon = await (
    await request.get('http://localhost:4000/lists/100')
  ).json();
  expect(anon.content.isLiked).toBe(false);

  const authed = await (
    await request.get('http://localhost:4000/lists/100', {
      headers: { Authorization: 'Bearer e2e-fake-token' },
    })
  ).json();
  expect(authed.content.isLiked).toBe(true);
});
```

- [ ] **Step 10: 執行驗證**

Run:

```bash
export PATH="$HOME/.nvm/versions/node/v22.15.1/bin:$PATH" && npm run build && npx playwright test e2e/specs/config-sanity.spec.ts --project=mobile-chrome
```

Expected: 3 passed

- [ ] **Step 11: Commit**

```bash
git add playwright.config.ts e2e/ package.json package-lock.json .gitignore
git commit -m "test: add playwright config and mock api server"
```

---

### Task 5: E2E — 身分汙染四條（最高價值）

| 欄位        | 值                                                                                                                                                                                                                |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stage       | e2e-specs                                                                                                                                                                                                         |
| status      | pending                                                                                                                                                                                                           |
| summary     | E1 like 汙染、E2 follow 汙染、E3 登出不殘留、E4 匿名 gating。這四條對應 `3144d71` 與 `5d88b72` 兩起跨多 session 除錯的 bug，是 unit test 結構上抓不到的類型（需真 SSR + 真瀏覽器 + 真 localStorage 三者同時在場） |
| evidence    | 待填：`npx playwright test e2e/specs/like-identity.spec.ts e2e/specs/follow-identity.spec.ts` 全綠輸出                                                                                                            |
| next_action | Task 6                                                                                                                                                                                                            |

**Files:**

- Create: `e2e/specs/like-identity.spec.ts`
- Create: `e2e/specs/follow-identity.spec.ts`

**Interfaces:**

- Consumes: Task 3 的 `[data-testid="like-button"][data-liked]`、`[data-testid="follow-button"][data-following]`；Task 4 的 `buildStorageState()` / `anonymousStorageState`
- Produces: 無（終端測試）

- [ ] **Step 1: 寫 like 汙染測試**

建立 `e2e/specs/like-identity.spec.ts`：

```ts
import { expect, test } from '@playwright/test';
import { anonymousStorageState, buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('logged-in viewer', () => {
  test.use({ storageState: buildStorageState() });

  // E1：SSR 匿名回應含 isLiked:false，不得汙染已登入用戶的 like 狀態
  test('E1 shows liked state on direct URL entry', async ({ page }) => {
    await page.goto('/usera/list/100');
    const likeButton = page.getByTestId('like-button');
    await expect(likeButton).toHaveAttribute('data-liked', 'true');
  });

  // E1b：重新整理後仍正確（確認不是靠某次幸運的 refetch 時序）
  test('E1b keeps liked state after reload', async ({ page }) => {
    await page.goto('/usera/list/100');
    await expect(page.getByTestId('like-button')).toHaveAttribute(
      'data-liked',
      'true'
    );
    await page.reload();
    await expect(page.getByTestId('like-button')).toHaveAttribute(
      'data-liked',
      'true'
    );
  });
});

test.describe('anonymous viewer', () => {
  test.use({ storageState: anonymousStorageState });

  // E4：匿名點讚應跳登入引導，且不得寫入 like 狀態
  test('E4 prompts signup instead of liking', async ({ page }) => {
    await page.goto('/usera/list/100');
    const likeButton = page.getByTestId('like-button');
    await expect(likeButton).toHaveAttribute('data-liked', 'false');
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('data-liked', 'false');
  });
});

// E3：登出後不得殘留前一位用戶的 like 狀態
test.describe('after logout', () => {
  test.use({ storageState: buildStorageState() });

  test('E3 does not leak previous user liked state', async ({ page }) => {
    await page.goto('/usera/list/100');
    await expect(page.getByTestId('like-button')).toHaveAttribute(
      'data-liked',
      'true'
    );

    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    await expect(page.getByTestId('like-button')).toHaveAttribute(
      'data-liked',
      'false'
    );
  });
});
```

- [ ] **Step 2: 執行 like 測試**

Run:

```bash
export PATH="$HOME/.nvm/versions/node/v22.15.1/bin:$PATH" && npx playwright test e2e/specs/like-identity.spec.ts --project=mobile-chrome
```

Expected: 4 passed

- [ ] **Step 3: 寫 follow 汙染測試**

建立 `e2e/specs/follow-identity.spec.ts`：

```ts
import { expect, test } from '@playwright/test';
import { anonymousStorageState, buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('logged-in viewer', () => {
  test.use({ storageState: buildStorageState() });

  // E2：usera 已 follow userb。直接貼 userb 的 list 網址時，
  // SSR 匿名回應含 isFollowing:false，不得汙染已登入用戶的 follow 狀態。
  test('E2 shows following state on direct URL entry', async ({ page }) => {
    await page.goto('/userb/list/102');
    await expect(page.getByTestId('follow-button')).toHaveAttribute(
      'data-following',
      'true'
    );
  });

  test('E2b keeps following state after reload', async ({ page }) => {
    await page.goto('/userb/list/102');
    await expect(page.getByTestId('follow-button')).toHaveAttribute(
      'data-following',
      'true'
    );
    await page.reload();
    await expect(page.getByTestId('follow-button')).toHaveAttribute(
      'data-following',
      'true'
    );
  });

  // 自己的 list 不該出現 follow 按鈕
  test('E2c hides follow button on own list', async ({ page }) => {
    await page.goto('/usera/list/100');
    await expect(page.getByTestId('follow-button')).toHaveCount(0);
  });
});

test.describe('anonymous viewer', () => {
  test.use({ storageState: anonymousStorageState });

  // 匿名必須看到可點的「未追蹤」按鈕，而非卡在骨架
  test('anonymous sees follow button in not-following state', async ({
    page,
  }) => {
    await page.goto('/userb/list/102');
    await expect(page.getByTestId('follow-button')).toHaveAttribute(
      'data-following',
      'false'
    );
  });
});
```

- [ ] **Step 4: 執行 follow 測試**

Run:

```bash
npx playwright test e2e/specs/follow-identity.spec.ts --project=mobile-chrome
```

Expected: 4 passed

- [ ] **Step 5: 雙引擎驗證**

Run:

```bash
npx playwright test e2e/specs/like-identity.spec.ts e2e/specs/follow-identity.spec.ts
```

Expected: mobile-chrome 與 mobile-safari 皆通過

- [ ] **Step 6: Commit**

```bash
git add e2e/specs/like-identity.spec.ts e2e/specs/follow-identity.spec.ts
git commit -m "test: add e2e specs for like and follow identity contamination"
```

---

### Task 6: E2E — private list 權限

| 欄位        | 值                                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stage       | e2e-specs                                                                                                                                                     |
| status      | pending                                                                                                                                                       |
| summary     | E7 無權用戶開他人 private list → Not Found（不洩漏存在性）；E8 擁有者開自己的 private list → 正常顯示。對應 `2e2ae82` 的 private list 功能與後續 SSR 403 修正 |
| evidence    | 待填：`npx playwright test e2e/specs/private-list.spec.ts` 全綠輸出                                                                                           |
| next_action | Task 7                                                                                                                                                        |

**Files:**

- Create: `e2e/specs/private-list.spec.ts`

**Interfaces:**

- Consumes: Task 4 的 mock server（list `101` 為 `usera` 的 private list，非擁有者取得 403）
- Produces: 無

- [ ] **Step 1: 寫測試**

建立 `e2e/specs/private-list.spec.ts`：

```ts
import { expect, test } from '@playwright/test';
import { anonymousStorageState, buildStorageState } from '../fixtures/auth';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

test.describe('owner', () => {
  test.use({ storageState: buildStorageState() });

  // E8：擁有者可正常看到自己的 private list
  test('E8 owner can view own private list', async ({ page }) => {
    await page.goto('/usera/list/101');
    await expect(page.getByText('Private List', { exact: true })).toBeVisible();
  });
});

test.describe('anonymous', () => {
  test.use({ storageState: anonymousStorageState });

  // E7：無權者看到 Not Found，且頁面不得洩漏 list 標題
  test('E7 anonymous gets not found for private list', async ({ page }) => {
    await page.goto('/usera/list/101');
    // 正向斷言確實抵達 Not Found 頁（透過 data-testid，與翻譯文案無關），
    // 避免「標題不存在」在頁面尚未載入完成時就誤判為通過。
    await expect(page.getByTestId('not-found')).toBeVisible();
    await expect(page.getByText('Private List', { exact: true })).toHaveCount(
      0
    );
  });
});

test.describe('public list stays reachable', () => {
  test.use({ storageState: anonymousStorageState });

  test('anonymous can view public list', async ({ page }) => {
    await page.goto('/usera/list/100');
    await expect(page.getByText('Public List', { exact: true })).toBeVisible();
  });
});
```

- [ ] **Step 2: 執行**

Run: `npx playwright test e2e/specs/private-list.spec.ts`
Expected: 3 passed（雙引擎共 6）

- [ ] **Step 3: Commit**

```bash
git add e2e/specs/private-list.spec.ts
git commit -m "test: add e2e spec for private list access control"
```

---

### Task 7: E2E — 分頁與 CRUD 快取同步

| 欄位        | 值                                                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| stage       | e2e-specs                                                                                                                                                                |
| status      | pending                                                                                                                                                                  |
| summary     | E5 ideas 無限捲動跨 3 頁以上不重複不漏（對應 `getNextPageParam` offset 不累加的 bug，第 3 頁才是觸發點）；E6 新增/刪除 idea 後兩份 infinite cache 同步（§13.2 雙軌手術） |
| evidence    | 待填：`npx playwright test e2e/specs/ideas-pagination.spec.ts e2e/specs/ideas-crud.spec.ts` 全綠輸出                                                                     |
| next_action | Task 8                                                                                                                                                                   |

**Files:**

- Create: `e2e/specs/ideas-pagination.spec.ts`
- Create: `e2e/specs/ideas-crud.spec.ts`

**Interfaces:**

- Consumes: Task 3 的 `[data-testid="idea-row"][data-idea-id]`；mock list `100` 含 41 則 idea（limit 20 → 需 3 頁）
- Produces: 無

- [ ] **Step 1: 寫分頁測試**

建立 `e2e/specs/ideas-pagination.spec.ts`：

```ts
import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.use({ storageState: buildStorageState() });

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

const collectIdeaIDs = async (page: import('@playwright/test').Page) =>
  page
    .locator('[data-testid="idea-row"]')
    .evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('data-idea-id') ?? '')
    );

// E5：limit=20、總數 41 → 需載入 3 頁。offset 若未累加，第 3 頁會重複第 2 頁內容。
test('E5 loads all ideas across three pages without duplicates or gaps', async ({
  page,
}) => {
  await page.goto('/usera/list/100');
  await expect(page.locator('[data-testid="idea-row"]').first()).toBeVisible();

  let previousCount = (await collectIdeaIDs(page)).length;
  while (previousCount < 41) {
    // mouse.wheel is unsupported on mobile WebKit, so scroll the last
    // rendered row into view instead — this crosses the IntersectionObserver
    // sentinel the same way a real scroll would, on every engine.
    await page
      .locator('[data-testid="idea-row"]')
      .last()
      .scrollIntoViewIfNeeded();
    // Wait on the concrete condition (row count growing) instead of a fixed
    // sleep: infinite-scroll timing varies, but a stalled count after a
    // reasonable window means the next page genuinely never arrived.
    await expect
      .poll(async () => (await collectIdeaIDs(page)).length, { timeout: 5_000 })
      .toBeGreaterThan(previousCount);
    previousCount = (await collectIdeaIDs(page)).length;
  }

  const ids = await collectIdeaIDs(page);
  expect(ids).toHaveLength(41);
  expect(new Set(ids).size).toBe(41); // 無重複
  expect(ids).toContain('100-idea-41'); // 無遺漏（最後一則）
});
```

- [ ] **Step 2: 執行分頁測試**

Run: `npx playwright test e2e/specs/ideas-pagination.spec.ts --project=mobile-chrome`
Expected: 1 passed

- [ ] **Step 3: 寫 CRUD 快取測試**

建立 `e2e/specs/ideas-crud.spec.ts`：

```ts
import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

test.use({ storageState: buildStorageState() });

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/__test__/reset');
});

// E6：驗證伺服器端刪除後，重新載入的畫面與伺服器狀態一致。
// **不涵蓋** optimistic 雙 cache 同步 —— 刪除走原始 API + reload，繞過 client mutation 路徑。
test('E6 idea deleted via API is reflected after reload', async ({ page, request }) => {
  await page.goto('/usera/list/101'); // private list，3 則 idea，屬於 usera
  await expect(page.locator('[data-testid="idea-row"]')).toHaveCount(3);

  // 直接透過 API 刪除後重新整理，驗證伺服器端與畫面一致
  await request.delete('http://localhost:4000/ideas/101-idea-1', {
    headers: { Authorization: 'Bearer e2e-fake-token' },
  });
  await page.reload();

  await expect(page.locator('[data-testid="idea-row"]')).toHaveCount(2);
  await expect(page.locator('[data-idea-id="101-idea-1"]')).toHaveCount(0);
});
```

⚠️ 本測試以 API + reload 驗證伺服器與渲染一致。**真正的 optimistic cache 同步（不 reload）留給 Task 12 的 unit test 涵蓋** —— 那是純函式邏輯，unit 層測起來更精確也更快。此處刻意不透過 UI 走完整刪除流程，因為刪除入口在 IdeaDrawer 內、互動路徑長且脆弱。

- [ ] **Step 4: 執行 CRUD 測試**

Run: `npx playwright test e2e/specs/ideas-crud.spec.ts --project=mobile-chrome`
Expected: 1 passed

- [ ] **Step 5: 全 E2E 回歸**

Run: `npx playwright test`
Expected: 全部 spec 於 mobile-chrome 與 mobile-safari 皆通過

- [ ] **Step 6: Commit**

```bash
git add e2e/specs/ideas-pagination.spec.ts e2e/specs/ideas-crud.spec.ts
git commit -m "test: add e2e specs for ideas pagination and cache sync"
```

---

### Task 8: 煙霧層（真 BE，5 條）

| 欄位        | 值                                                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| stage       | e2e-smoke                                                                                                                                      |
| status      | pending                                                                                                                                        |
| summary     | 5 條打真 dev BE 的煙霧測試，驗證契約未漂移。以 `E2E_ACCESS_TOKEN` secret 提供真 token；secret 缺席時整組 skip 而非 red，避免 token 過期擋住 PR |
| evidence    | 待填：本機帶 token 執行的通過輸出 + 無 token 時的 skip 輸出                                                                                    |
| next_action | Task 9                                                                                                                                         |

**Files:**

- Create: `e2e/smoke/smoke.spec.ts`
- Modify: `.env.example`

**Interfaces:**

- Consumes: 環境變數 `E2E_ACCESS_TOKEN`、`E2E_SMOKE_BASE_URL`、`E2E_SMOKE_USER_CODE`、`E2E_SMOKE_LIST_ID`
- Produces: 無

- [ ] **Step 1: 補 .env.example**

`.env.example` 追加（**只放變數名稱，不放值**）：

```
# E2E 煙霧測試（選用；未設定時煙霧層自動 skip）
E2E_ACCESS_TOKEN=
E2E_SMOKE_BASE_URL=
E2E_SMOKE_USER_CODE=
E2E_SMOKE_LIST_ID=
```

- [ ] **Step 2: 寫煙霧測試**

建立 `e2e/smoke/smoke.spec.ts`：

```ts
import { expect, test } from '@playwright/test';
import { buildStorageState } from '../fixtures/auth';

const TOKEN = process.env.E2E_ACCESS_TOKEN;
const USER_CODE = process.env.E2E_SMOKE_USER_CODE ?? '';
const LIST_ID = process.env.E2E_SMOKE_LIST_ID ?? '';

// token 過期或未設定時整組 skip —— 不讓煙霧層擋住 PR
test.skip(
  !TOKEN || !USER_CODE || !LIST_ID,
  'E2E_ACCESS_TOKEN / E2E_SMOKE_USER_CODE / E2E_SMOKE_LIST_ID not configured'
);

test.use({
  storageState: buildStorageState({ token: TOKEN }),
});

test('S1 discovery page renders', async ({ page }) => {
  await page.goto('/discovery');
  await expect(page).not.toHaveURL(/goToMobile|error/);
});

test('S2 user profile page renders list section', async ({ page }) => {
  await page.goto(`/${USER_CODE}`);
  await expect(page.getByTestId('hero')).toBeVisible();
});

test('S3 list page renders with like button', async ({ page }) => {
  await page.goto(`/${USER_CODE}/list/${LIST_ID}`);
  await expect(page.getByTestId('like-button')).toBeVisible();
});

test('S4 list page loads ideas', async ({ page }) => {
  await page.goto(`/${USER_CODE}/list/${LIST_ID}`);
  await expect(page.locator('[data-testid="idea-row"]').first()).toBeVisible();
});

test('S5 real API contract has not drifted on list endpoint', async ({
  request,
}) => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  test.skip(!base, 'NEXT_PUBLIC_API_BASE_URL not set');

  const res = await request.get(`${base}/lists/${LIST_ID}?offset=0&limit=1`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  expect(res.status()).toBe(200);

  const body = await res.json();
  // 契約關鍵欄位 —— 任一消失代表 BE 改了合約，前端 zod parse 會在 runtime 炸
  expect(body.content).toHaveProperty('isLiked');
  expect(body.content).toHaveProperty('likeCount');
  expect(body.content).toHaveProperty('ideaTotalCount');
  expect(body.content).toHaveProperty('owner');
  expect(body).toHaveProperty('totalElements');
});
```

- [ ] **Step 3: 驗證 skip 行為（無 token）**

Run:

```bash
npx playwright test --project=smoke
```

Expected: 5 skipped（確認 secret 缺席時不會 red）

- [ ] **Step 4: 驗證通過行為（有 token）**

人工取得 token：瀏覽器登入 dev 站 → DevTools Console 執行
`JSON.parse(localStorage.getItem('auth-storage')).state.accessToken` → 複製。

Run（**token 只放環境變數，切勿寫進任何檔案**）：

```bash
E2E_ACCESS_TOKEN='<貼上>' E2E_SMOKE_BASE_URL='https://dev.relist.cc' \
E2E_SMOKE_USER_CODE='<測試帳號>' E2E_SMOKE_LIST_ID='<測試 list>' \
npx playwright test --project=smoke
```

Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add e2e/smoke/smoke.spec.ts .env.example
git commit -m "test: add real-backend smoke specs with skip-when-unconfigured guard"
```

---

### Task 9: E2E 接入 CI

| 欄位        | 值                                                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| stage       | ci-integration                                                                                                                                 |
| status      | pending                                                                                                                                        |
| summary     | 在 Task 1 的 workflow 追加 `e2e` job：跑確定性層（mock server，無外部依賴）；煙霧層僅在 secret 存在時執行。失敗時上傳 Playwright report 供除錯 |
| evidence    | 待填：PR 上 e2e job 綠燈的 Actions 連結 + 一次故意失敗時的 report artifact                                                                     |
| next_action | Task 10                                                                                                                                        |

**Files:**

- Modify: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: Task 1 的 workflow 結構；Task 4 的 `npm run test:e2e`
- Produces: `e2e` job

- [ ] **Step 1: 追加 e2e job**

`.github/workflows/ci.yml` 於 `jobs:` 底下追加（與 `verify` 同層）：

```yaml
e2e:
  runs-on: ubuntu-latest
  needs: verify
  steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-node@v4
      with:
        node-version-file: '.nvmrc'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright browsers
      run: npx playwright install --with-deps chromium webkit

    - name: Build app
      run: npm run build
      env:
        NEXT_PUBLIC_API_BASE_URL: http://localhost:4000
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: e2e-placeholder-client-id
        NEXT_PUBLIC_SITE_URL: http://localhost:8080
        SEO_FETCH_REVALIDATE: '0'

    - name: Run deterministic E2E
      run: npx playwright test --project=mobile-chrome --project=mobile-safari

    - name: Run smoke E2E
      if: ${{ env.E2E_ACCESS_TOKEN != '' }}
      run: npx playwright test --project=smoke
      env:
        E2E_ACCESS_TOKEN: ${{ secrets.E2E_ACCESS_TOKEN }}
        E2E_SMOKE_BASE_URL: ${{ secrets.E2E_SMOKE_BASE_URL }}
        E2E_SMOKE_USER_CODE: ${{ secrets.E2E_SMOKE_USER_CODE }}
        E2E_SMOKE_LIST_ID: ${{ secrets.E2E_SMOKE_LIST_ID }}
        NEXT_PUBLIC_API_BASE_URL: ${{ secrets.E2E_SMOKE_API_BASE_URL }}

    - name: Upload Playwright report
      if: ${{ !cancelled() }}
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 7
```

- [ ] **Step 2: Commit 並開 PR 驗證**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: run playwright e2e on pull requests"
git push -u origin feature/test-infrastructure
```

- [ ] **Step 3: 確認 Actions 結果**

於 GitHub PR 頁確認 `verify` 與 `e2e` 兩個 job 皆綠。將 Actions run URL 填入本 task 的 `evidence`。

---

### Task 10: Vitest 設定

| 欄位        | 值                                                                                                                               |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| stage       | unit-infra                                                                                                                       |
| status      | pending                                                                                                                          |
| summary     | 安裝並設定 Vitest。選 Vitest 而非 Jest：專案 `"type": "module"`，Vitest 原生 ESM 零 transform 設定，且與既有 Vite/SWC 工具鏈一致 |
| evidence    | 待填：`npx vitest run` 首個 sanity test 通過輸出                                                                                 |
| next_action | Task 11                                                                                                                          |

**Files:**

- Create: `vitest.config.ts`
- Create: `src/lib/utils.test.ts`
- Modify: `package.json`
- Modify: `tsconfig.app.json`

**Interfaces:**

- Produces: `npm run test:unit`；`@/` alias 於測試中可用
- Consumes: 無

- [ ] **Step 1: 安裝相依**

Run:

```bash
export PATH="$HOME/.nvm/versions/node/v22.15.1/bin:$PATH" && npm i -D vitest @vitest/coverage-v8 jsdom
```

Expected: 安裝成功

`@testing-library/react`、`@testing-library/jest-dom`、`@vitejs/plugin-react` 不安裝 —— 目前及規劃中的單元測試皆非 component-rendering（純函式、zod schema、zustand store）。日後若首次需要 render 元件，應同時安裝這三個套件並在 `test.setupFiles` 加入 `@testing-library/jest-dom` 的 import，否則其 matcher（`toBeInTheDocument` 等）不會被註冊。

- [ ] **Step 2: 建立 vitest 設定**

建立 `vitest.config.ts`：

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Component-rendering deps deliberately not installed — see Step 1 note.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/locales/**'],
    },
  },
});
```

- [ ] **Step 3: 加 npm scripts**

`package.json` 的 `scripts` 追加：

```json
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:unit:coverage": "vitest run --coverage",
```

- [ ] **Step 4: 讓 tsc 認得 vitest globals**

`tsconfig.app.json` 的 `compilerOptions` 追加 `types`。**測試檔一併納入型別檢查**（不加 exclude）—— Vitest 本身不做型別檢查，排除等於讓測試碼零型別防線；`tsconfig.app.json` 只供手動 type check，Next build 走 root `tsconfig.json`，納入測試檔無副作用：

```json
    "composite": true,
    // "types" 會關閉 TS 自動 @types/* 探索，故 node/react 需明列 ——
    // process.env（Node）與 JSX（React）在 src/ 全域使用
    "types": ["vitest/globals", "node", "react", "react-dom"]
  },
  "include": ["src"]
}
```

- [ ] **Step 5: 寫 sanity test**

建立 `src/lib/utils.test.ts`：

```ts
import { cn } from '@/lib/utils';
import { describe, expect, it } from 'vitest';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });

  it('lets later tailwind classes win', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
```

- [ ] **Step 6: 執行**

Run: `npx vitest run`
Expected: 3 passed

- [ ] **Step 7: type check**

Run: `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -v TS6305`
Expected: 零輸出

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts src/lib/utils.test.ts package.json package-lock.json tsconfig.app.json
git commit -m "test: add vitest setup with jsdom and path alias"
```

---

### Task 11: 抽出 offset 計算並測試（U1）

| 欄位        | 值                                                                                                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stage       | unit-specs                                                                                                                                                                  |
| status      | pending                                                                                                                                                                     |
| summary     | `getNextPageParam` 目前內嵌於 hook 無法單測。抽成純函式後補測 —— 這正是 `84d1d29` 修掉的「第 3 頁起 offset 不累加、抓重複資料」bug，抽出後同時收斂 §13.2 記載的雙軌重複邏輯 |
| evidence    | 待填：`npx vitest run src/hooks/api/ideas/offset.test.ts` 通過輸出 + hook 改用新函式的 diff                                                                                 |
| next_action | Task 12                                                                                                                                                                     |

**Files:**

- Create: `src/hooks/api/ideas/offset.ts`
- Create: `src/hooks/api/ideas/offset.test.ts`
- Modify: `src/hooks/api/ideas/useGetInfiniteIdeasUnderList.ts`

**Interfaces:**

- Produces:
  - `computeNextOffset(totalFetched: number, total: number, lastPageSize: number): number | undefined`
  - `sumFetched<T>(pages: T[], sizeOf: (page: T) => number): number`
- Consumes: 無

- [ ] **Step 1: 寫失敗測試**

建立 `src/hooks/api/ideas/offset.test.ts`：

```ts
import { computeNextOffset, sumFetched } from '@/hooks/api/ideas/offset';
import { describe, expect, it } from 'vitest';

describe('sumFetched', () => {
  it('sums page sizes', () => {
    expect(sumFetched([{ n: 20 }, { n: 20 }, { n: 1 }], (p) => p.n)).toBe(41);
  });

  it('returns 0 for no pages', () => {
    expect(sumFetched([], (p: { n: number }) => p.n)).toBe(0);
  });
});

describe('computeNextOffset', () => {
  it('returns accumulated offset after first page', () => {
    expect(computeNextOffset(20, 41, 20)).toBe(20);
  });

  // 這是原 bug：第 2 頁後若用 lastPage.length 會停在 20，第 3 頁抓到重複資料
  it('keeps advancing on the third page', () => {
    expect(computeNextOffset(40, 41, 20)).toBe(40);
  });

  it('returns undefined when all items fetched', () => {
    expect(computeNextOffset(41, 41, 1)).toBeUndefined();
  });

  it('returns undefined when fetched exceeds total', () => {
    expect(computeNextOffset(45, 41, 5)).toBeUndefined();
  });

  it('returns undefined when last page was empty', () => {
    expect(computeNextOffset(20, 41, 0)).toBeUndefined();
  });

  it('returns undefined when total is zero', () => {
    expect(computeNextOffset(0, 0, 0)).toBeUndefined();
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npx vitest run src/hooks/api/ideas/offset.test.ts`
Expected: FAIL —— `Failed to resolve import "@/hooks/api/ideas/offset"`

- [ ] **Step 3: 實作純函式**

建立 `src/hooks/api/ideas/offset.ts`：

```ts
/** 累加已取得的項目數。infinite query 的 offset 必須用累計值，不能用最後一頁的長度。 */
export const sumFetched = <T>(
  pages: T[],
  sizeOf: (page: T) => number
): number => pages.reduce((sum, page) => sum + sizeOf(page), 0);

/**
 * 計算下一頁 offset。回傳 undefined 代表沒有下一頁。
 * @param totalFetched 已取得的累計項目數
 * @param total 伺服器回報的總數
 * @param lastPageSize 最後一頁的項目數（為 0 代表已到底）
 */
export const computeNextOffset = (
  totalFetched: number,
  total: number,
  lastPageSize: number
): number | undefined => {
  if (lastPageSize === 0) return undefined;
  if (totalFetched >= total) return undefined;
  return totalFetched;
};
```

- [ ] **Step 4: 執行確認通過**

Run: `npx vitest run src/hooks/api/ideas/offset.test.ts`
Expected: 8 passed

- [ ] **Step 5: 讓 hook 改用新函式**

`src/hooks/api/ideas/useGetInfiniteIdeasUnderList.ts`：

頂部 import 追加：

```ts
import { computeNextOffset, sumFetched } from '@/hooks/api/ideas/offset';
```

把 `getNextPageParam` 與 `select` 兩段替換為：

```ts
      getNextPageParam: (lastPage, allPages) => {
        const { ideas, ideaTotalCount } = lastPage.body;
        const totalFetched = sumFetched(allPages, (page) => page.body.ideas.length);
        return computeNextOffset(totalFetched, ideaTotalCount, ideas.length);
      },
      select: (data) => ({
        pages: data.pages.map((page, index) => ({
          ideas: page.body.ideas,
          nextOffset: sumFetched(
            data.pages.slice(0, index + 1),
            (p) => p.body.ideas.length
          ),
          total: page.body.ideaTotalCount ?? 0,
        })),
      }),
```

- [ ] **Step 6: 驗證行為未變**

Run: `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -v TS6305`
Expected: 零輸出

Run: `npx playwright test e2e/specs/ideas-pagination.spec.ts --project=mobile-chrome`
Expected: 1 passed（重構後分頁行為不變）

- [ ] **Step 7: Commit**

```bash
git add src/hooks/api/ideas/offset.ts src/hooks/api/ideas/offset.test.ts \
        src/hooks/api/ideas/useGetInfiniteIdeasUnderList.ts
git commit -m "refactor: extract infinite offset computation and add unit tests"
```

---

### Task 12: cache helper 與 whitelist 測試（U2、U3）

| 欄位        | 值                                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stage       | unit-specs                                                                                                                                                          |
| status      | pending                                                                                                                                                             |
| summary     | `updateEntryCaches` / `updateInfiniteCaches` 被 3 支 mutation 共用，錯了整批快取髒；`contractPathToRegExp` 的動態 path 與正則跳脫邊界多。兩者皆為純函式，測起來便宜 |
| evidence    | 待填：`npx vitest run src/hooks/api/utils.test.ts src/api/whitelist.test.ts` 通過輸出                                                                               |
| next_action | Task 13                                                                                                                                                             |

**Files:**

- Create: `src/hooks/api/utils.test.ts`
- Create: `src/api/whitelist.test.ts`
- Modify: `src/api/whitelist.ts`（匯出 `contractPathToRegExp`）

**Interfaces:**

- Consumes: `updateEntryCaches` / `updateInfiniteCaches`（既有匯出）
- Produces: `contractPathToRegExp` 由 module-private 改為具名匯出

- [ ] **Step 1: 匯出 contractPathToRegExp**

`src/api/whitelist.ts:8`，把 `const contractPathToRegExp` 改為：

```ts
export const contractPathToRegExp = (path: string): RegExp => {
```

- [ ] **Step 2: 寫 whitelist 測試**

建立 `src/api/whitelist.test.ts`：

```ts
import { contractPathToRegExp, isStatusWhitelist } from '@/api/whitelist';
import { describe, expect, it } from 'vitest';

describe('contractPathToRegExp', () => {
  it('matches a static path exactly', () => {
    const re = contractPathToRegExp('/publish/limits/lists');
    expect(re.test('/publish/limits/lists')).toBe(true);
    expect(re.test('/publish/limits/listsX')).toBe(false);
    expect(re.test('/publish/limits')).toBe(false);
  });

  it('matches a single dynamic segment', () => {
    const re = contractPathToRegExp('/lists/:listID');
    expect(re.test('/lists/100')).toBe(true);
    expect(re.test('/lists/abc-def')).toBe(true);
    expect(re.test('/lists/100/order')).toBe(false);
    expect(re.test('/lists/')).toBe(false);
  });

  it('matches a leading dynamic segment', () => {
    const re = contractPathToRegExp('/:userCode/lists');
    expect(re.test('/usera/lists')).toBe(true);
    expect(re.test('/usera/lists/100')).toBe(false);
  });

  it('matches multiple dynamic segments', () => {
    const re = contractPathToRegExp('/lists/:listID/order');
    expect(re.test('/lists/100/order')).toBe(true);
    expect(re.test('/lists/100/reorder')).toBe(false);
  });

  it('escapes regex metacharacters in static segments', () => {
    const re = contractPathToRegExp('/a.b/c');
    expect(re.test('/a.b/c')).toBe(true);
    expect(re.test('/aXb/c')).toBe(false); // '.' 必須被跳脫
  });
});

describe('isStatusWhitelist', () => {
  it('silences 403 on the list endpoint', () => {
    expect(isStatusWhitelist('GET', '/lists/100', 403)).toBe(true);
  });

  it('is case-insensitive on method', () => {
    expect(isStatusWhitelist('get', '/lists/100', 403)).toBe(true);
  });

  it('does not silence other statuses', () => {
    expect(isStatusWhitelist('GET', '/lists/100', 404)).toBe(false);
  });

  it('does not silence other paths', () => {
    expect(isStatusWhitelist('GET', '/usera/info', 403)).toBe(false);
  });
});
```

- [ ] **Step 3: 寫 cache helper 測試**

建立 `src/hooks/api/utils.test.ts`：

```ts
import { updateEntryCaches, updateInfiniteCaches } from '@/hooks/api/utils';
import { listsContract } from '@/api/contracts';
import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it } from 'vitest';

type ListsRoute = typeof listsContract.getListsContract;

const entry = (title: string) => ({
  status: 200,
  body: {
    code: '0000',
    message: 'ok',
    content: { title },
    offset: 0,
    limit: 3,
    totalElements: 1,
  },
  headers: new Headers(),
});

describe('updateEntryCaches', () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('applies the updater to an existing cache', () => {
    queryClient.setQueryData(['k'], entry('before'));
    updateEntryCaches<ListsRoute>(queryClient, ['k'], (body) => ({
      ...body,
      content: { ...body.content, title: 'after' },
    }));
    const result = queryClient.getQueryData<ReturnType<typeof entry>>(['k']);
    expect(result?.body.content.title).toBe('after');
  });

  it('is a no-op when the cache is absent', () => {
    updateEntryCaches<ListsRoute>(queryClient, ['missing'], (body) => body);
    expect(queryClient.getQueryData(['missing'])).toBeUndefined();
  });
});

describe('updateInfiniteCaches', () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('replaces pages via the updater', () => {
    queryClient.setQueryData(['inf'], {
      pages: [entry('p1'), entry('p2')],
      pageParams: [0, 1],
    });

    updateInfiniteCaches<ListsRoute>(queryClient, ['inf'], (pages) =>
      pages.map((page) => ({
        ...page,
        body: { ...page.body, content: { ...page.body.content, title: 'x' } },
      }))
    );

    const result = queryClient.getQueryData<{
      pages: ReturnType<typeof entry>[];
    }>(['inf']);
    expect(result?.pages.map((p) => p.body.content.title)).toEqual(['x', 'x']);
  });

  it('preserves pageParams', () => {
    queryClient.setQueryData(['inf'], {
      pages: [entry('p1')],
      pageParams: [0],
    });
    updateInfiniteCaches<ListsRoute>(queryClient, ['inf'], (pages) => pages);
    const result = queryClient.getQueryData<{ pageParams: number[] }>(['inf']);
    expect(result?.pageParams).toEqual([0]);
  });

  it('is a no-op when the cache is absent', () => {
    updateInfiniteCaches<ListsRoute>(
      queryClient,
      ['missing'],
      (pages) => pages
    );
    expect(queryClient.getQueryData(['missing'])).toBeUndefined();
  });
});
```

- [ ] **Step 4: 執行**

Run: `npx vitest run src/api/whitelist.test.ts src/hooks/api/utils.test.ts`
Expected: 14 passed

- [ ] **Step 5: type check**

Run: `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -v TS6305`
Expected: 零輸出

- [ ] **Step 6: Commit**

```bash
git add src/api/whitelist.ts src/api/whitelist.test.ts src/hooks/api/utils.test.ts
git commit -m "test: add unit tests for cache helpers and path matcher"
```

---

### Task 13: zod 契約測試（U4）

| 欄位        | 值                                                                                                                                                                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stage       | unit-specs                                                                                                                                                                                                                          |
| status      | pending                                                                                                                                                                                                                             |
| summary     | 專案完全以 zod schema 定義 BE 契約，卻無任何測試驗證 schema 與真實回應相符 —— BE 改欄位時只會在 runtime 炸。以固定樣本鎖住關鍵 schema 的 parse 行為，並明確標記已知的型別謊言（`isLiked` 宣告為 boolean，hydration 會塞 undefined） |
| evidence    | 待填：`npx vitest run src/api/schemas/contract.test.ts` 通過輸出                                                                                                                                                                    |
| next_action | Task 14                                                                                                                                                                                                                             |

**Files:**

- Create: `src/api/schemas/contract.test.ts`

**Interfaces:**

- Consumes: `listsSchema`、`ideasSchema`、`usersSchema`、`publishSchema`
- Produces: 無

- [ ] **Step 1: 寫測試**

建立 `src/api/schemas/contract.test.ts`：

```ts
import {
  ideasSchema,
  listsSchema,
  publishSchema,
  usersSchema,
} from '@/api/schemas';
import { describe, expect, it } from 'vitest';

const listResponseSample = {
  code: '0000',
  message: 'success',
  content: {
    id: '100',
    title: 'Public List',
    description: 'A public list',
    coverImage: '',
    externalLink: '',
    categoryID: 1,
    type: 0,
    likeCount: 1,
    isLiked: true,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ideas: [
      {
        id: '100-idea-1',
        title: 'Idea 1',
        description: '',
        coverImage: '',
        externalLink: '',
      },
    ],
    ideaTotalCount: 41,
    owner: {
      id: 1,
      displayName: 'User A',
      userCode: 'usera',
      profileImage: '',
    },
  },
  offset: 0,
  limit: 3,
  totalElements: 41,
};

describe('listsSchema.getResponse', () => {
  it('accepts a full list response', () => {
    expect(() =>
      listsSchema.getResponse.parse(listResponseSample)
    ).not.toThrow();
  });

  it('requires offset, limit and totalElements (infinite response)', () => {
    const { offset: _offset, ...withoutOffset } = listResponseSample;
    expect(() => listsSchema.getResponse.parse(withoutOffset)).toThrow();
  });

  it('rejects a numeric id (all ids are strings)', () => {
    const bad = {
      ...listResponseSample,
      content: { ...listResponseSample.content, id: 100 },
    };
    expect(() => listsSchema.getResponse.parse(bad)).toThrow();
  });

  // 已知型別謊言：schema 要求 isLiked 為 boolean，但 SSR hydration 會 strip 成 undefined。
  // 此測試把該落差固化為文件——若日後把 schema 改為 .optional()，本測試會提醒同步更新 §13。
  it('rejects undefined isLiked, documenting the hydration strip gap', () => {
    const stripped = {
      ...listResponseSample,
      content: { ...listResponseSample.content, isLiked: undefined },
    };
    expect(() => listsSchema.getResponse.parse(stripped)).toThrow();
  });
});

describe('ideasSchema.getIdeasUnderListResponse', () => {
  it('accepts an ideas payload', () => {
    expect(() =>
      ideasSchema.getIdeasUnderListResponse.parse({
        ideas: [
          {
            id: 'i1',
            title: 'T',
            description: '',
            coverImage: '',
            externalLink: '',
          },
        ],
        ideaTotalCount: 1,
      })
    ).not.toThrow();
  });

  it('accepts an empty ideas array', () => {
    expect(() =>
      ideasSchema.getIdeasUnderListResponse.parse({
        ideas: [],
        ideaTotalCount: 0,
      })
    ).not.toThrow();
  });

  it('rejects a negative total', () => {
    expect(() =>
      ideasSchema.getIdeasUnderListResponse.parse({
        ideas: [],
        ideaTotalCount: -1,
      })
    ).toThrow();
  });
});

describe('usersSchema.getInfoResponse', () => {
  const sample = {
    code: '0000',
    message: 'success',
    content: {
      id: 1,
      displayName: 'User A',
      userCode: 'usera',
      profileImage: '',
      listCount: 2,
      followerCount: 0,
      followingCount: 1,
      isFollowing: false,
    },
  };

  it('accepts a full user info response', () => {
    expect(() => usersSchema.getInfoResponse.parse(sample)).not.toThrow();
  });

  it('treats isFollowing as optional', () => {
    const { isFollowing: _isFollowing, ...content } = sample.content;
    expect(() =>
      usersSchema.getInfoResponse.parse({ ...sample, content })
    ).not.toThrow();
  });

  it('requires listCount', () => {
    const { listCount: _listCount, ...content } = sample.content;
    expect(() =>
      usersSchema.getInfoResponse.parse({ ...sample, content })
    ).toThrow();
  });
});

describe('publishSchema.getListsLimitsResponse', () => {
  it('accepts a nullable remainingCount for unlimited users', () => {
    expect(() =>
      publishSchema.getListsLimitsResponse.parse({
        code: '0000',
        message: 'success',
        content: {
          usedCount: 3,
          limitCount: 0,
          remainingCount: null,
          isUnlimited: true,
        },
      })
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: 執行**

Run: `npx vitest run src/api/schemas/contract.test.ts`
Expected: 12 passed

- [ ] **Step 3: Commit**

```bash
git add src/api/schemas/contract.test.ts
git commit -m "test: add zod contract tests for core API schemas"
```

---

### Task 14: 額度判斷抽出並測試（U5）

| 欄位        | 值                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| stage       | unit-specs                                                                                                                                                                     |
| status      | pending                                                                                                                                                                        |
| summary     | `canStillCreate` 內嵌於 `useCheckCreateQuota` 無法單測，而 ARCHITECTURE.md §13（TODO-27）記載 `isUnlimited` / `null` 分支對 unlimited 用戶有髒寫風險。抽成純函式並補齊分支測試 |
| evidence    | 待填：`npx vitest run src/hooks/queries/publish/quota.test.ts` 通過輸出                                                                                                        |
| next_action | Task 15                                                                                                                                                                        |

**Files:**

- Create: `src/hooks/queries/publish/quota.ts`
- Create: `src/hooks/queries/publish/quota.test.ts`
- Modify: `src/hooks/queries/publish/useCheckCreateQuota.ts`

**Interfaces:**

- Produces: `canStillCreate(limits: PublishLimits): boolean`、`PublishLimits` 型別
- Consumes: 無

- [ ] **Step 1: 寫失敗測試**

建立 `src/hooks/queries/publish/quota.test.ts`：

```ts
import { canStillCreate } from '@/hooks/queries/publish/quota';
import { describe, expect, it } from 'vitest';

describe('canStillCreate', () => {
  it('allows unlimited users regardless of remainingCount', () => {
    expect(canStillCreate({ isUnlimited: true, remainingCount: 0 })).toBe(true);
  });

  it('allows unlimited users when remainingCount is null', () => {
    expect(canStillCreate({ isUnlimited: true, remainingCount: null })).toBe(
      true
    );
  });

  it('allows limited users with remaining quota', () => {
    expect(canStillCreate({ isUnlimited: false, remainingCount: 1 })).toBe(
      true
    );
  });

  it('blocks limited users with no quota left', () => {
    expect(canStillCreate({ isUnlimited: false, remainingCount: 0 })).toBe(
      false
    );
  });

  it('blocks limited users when remainingCount is null', () => {
    expect(canStillCreate({ isUnlimited: false, remainingCount: null })).toBe(
      false
    );
  });

  it('blocks limited users with a negative remainingCount', () => {
    expect(canStillCreate({ isUnlimited: false, remainingCount: -1 })).toBe(
      false
    );
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npx vitest run src/hooks/queries/publish/quota.test.ts`
Expected: FAIL —— `Failed to resolve import "@/hooks/queries/publish/quota"`

- [ ] **Step 3: 實作**

建立 `src/hooks/queries/publish/quota.ts`：

```ts
export interface PublishLimits {
  isUnlimited: boolean;
  remainingCount: number | null;
}

/**
 * 是否還能建立。unlimited 用戶不受 remainingCount 影響；
 * 非 unlimited 且 remainingCount 為 null 時視為無額度（保守拒絕）。
 */
export const canStillCreate = (limits: PublishLimits): boolean =>
  limits.isUnlimited || (limits.remainingCount ?? 0) > 0;
```

- [ ] **Step 4: 執行確認通過**

Run: `npx vitest run src/hooks/queries/publish/quota.test.ts`
Expected: 6 passed

- [ ] **Step 5: 讓 hook 改用新函式**

`src/hooks/queries/publish/useCheckCreateQuota.ts`：

頂部 import 追加：

```ts
import { canStillCreate } from '@/hooks/queries/publish/quota';
```

刪除 hook 內原本的 `const canStillCreate = (limits: {...}) => ...` 定義（約 line 16-19），其餘呼叫處不變。回傳物件中的 `canStillCreate` 保留（現在指向匯入的函式）。

- [ ] **Step 6: 驗證**

Run: `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -v TS6305`
Expected: 零輸出

Run: `npx vitest run`
Expected: 全部通過

- [ ] **Step 7: Commit**

```bash
git add src/hooks/queries/publish/quota.ts src/hooks/queries/publish/quota.test.ts \
        src/hooks/queries/publish/useCheckCreateQuota.ts
git commit -m "refactor: extract publish quota predicate and add unit tests"
```

---

### Task 15: like store 行為測試（U6）

| 欄位        | 值                                                                                                                                                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stage       | unit-specs                                                                                                                                                                                                                  |
| status      | pending                                                                                                                                                                                                                     |
| summary     | `useLikeStore` 的 `confirmed` 機制是 `4bc46a9` 修掉 like/follow 連點 race condition 的核心（debounce flush 前比對 optimistic 與 confirmed）。以 store 層測試鎖住此行為，並固化「getIsLiked 把未知塌縮為 false」這個已知取捨 |
| evidence    | 待填：`npx vitest run src/stores/useLikeStore.test.ts` 通過輸出                                                                                                                                                             |
| next_action | Task 16                                                                                                                                                                                                                     |

**Files:**

- Create: `src/stores/useLikeStore.test.ts`

**Interfaces:**

- Consumes: `useLikeStore`（default export，非 persist store，可直接操作）
- Produces: 無

- [ ] **Step 1: 寫測試**

建立 `src/stores/useLikeStore.test.ts`：

```ts
import useLikeStore from '@/stores/useLikeStore';
import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  useLikeStore.getState().clearAllLikeStatus();
});

describe('useLikeStore optimistic state', () => {
  it('reports no state before seeding', () => {
    expect(useLikeStore.getState().hasLikeState('100')).toBe(false);
  });

  // 已知取捨：未知態被塌縮為 false，所以 UI 拿不到「未知」。
  // 若日後改為 boolean | undefined，本測試會提醒同步更新 ARCHITECTURE.md §13。
  it('collapses unknown state to false', () => {
    expect(useLikeStore.getState().getIsLiked('100')).toBe(false);
  });

  it('stores and reads an optimistic value', () => {
    useLikeStore.getState().setIsLiked('100', true);
    expect(useLikeStore.getState().getIsLiked('100')).toBe(true);
    expect(useLikeStore.getState().hasLikeState('100')).toBe(true);
  });

  it('keeps per-list state independent', () => {
    useLikeStore.getState().setIsLiked('100', true);
    useLikeStore.getState().setIsLiked('101', false);
    expect(useLikeStore.getState().getIsLiked('100')).toBe(true);
    expect(useLikeStore.getState().getIsLiked('101')).toBe(false);
  });
});

describe('useLikeStore confirmed state (race-condition guard)', () => {
  it('tracks confirmed separately from optimistic', () => {
    useLikeStore.getState().setConfirmedIsLiked('100', false);
    useLikeStore.getState().setIsLiked('100', true);

    expect(useLikeStore.getState().getConfirmedIsLiked('100')).toBe(false);
    expect(useLikeStore.getState().getIsLiked('100')).toBe(true);
  });

  // debounce flush 的判斷依據：兩值相同代表無需送 API
  it('signals no-op when optimistic matches confirmed', () => {
    useLikeStore.getState().setConfirmedIsLiked('100', true);
    useLikeStore.getState().setIsLiked('100', true);

    const state = useLikeStore.getState();
    expect(state.getIsLiked('100')).toBe(state.getConfirmedIsLiked('100'));
  });

  it('reports whether a confirmed state exists', () => {
    expect(useLikeStore.getState().hasConfirmedLikeState('100')).toBe(false);
    useLikeStore.getState().setConfirmedIsLiked('100', true);
    expect(useLikeStore.getState().hasConfirmedLikeState('100')).toBe(true);
  });
});

describe('useLikeStore clearing', () => {
  it('clears a single list', () => {
    useLikeStore.getState().setIsLiked('100', true);
    useLikeStore.getState().setIsLiked('101', true);
    useLikeStore.getState().clearLikeStatus('100');

    expect(useLikeStore.getState().hasLikeState('100')).toBe(false);
    expect(useLikeStore.getState().hasLikeState('101')).toBe(true);
  });

  // 這是登出時防止身分殘留的關鍵（resetIdentityCaches 會呼叫）
  it('clears every list on logout', () => {
    useLikeStore.getState().setIsLiked('100', true);
    useLikeStore.getState().setConfirmedIsLiked('100', true);
    useLikeStore.getState().clearAllLikeStatus();

    expect(useLikeStore.getState().hasLikeState('100')).toBe(false);
    expect(useLikeStore.getState().hasConfirmedLikeState('100')).toBe(false);
  });
});
```

- [ ] **Step 2: 執行**

Run: `npx vitest run src/stores/useLikeStore.test.ts`
Expected: 10 passed

⚠️ 若 `clearAllLikeStatus` 未同時清 `confirmedLikeMap`，最後一個測試會失敗 —— **那是真 bug**（登出後 confirmed 殘留會讓下一位用戶的第一次點擊被誤判為 no-op）。修 `src/stores/useLikeStore.ts` 的 `clearAllLikeStatus` 使其同時重置兩個 Map，再重跑。

- [ ] **Step 3: Commit**

```bash
git add src/stores/useLikeStore.test.ts src/stores/useLikeStore.ts
git commit -m "test: add unit tests for like store optimistic and confirmed state"
```

---

### Task 16: Vitest 接入 CI

| 欄位        | 值                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------- |
| stage       | ci-integration                                                                                    |
| status      | pending                                                                                           |
| summary     | 在 `verify` job 追加單元測試步驟。放在 build 之前 —— 單元測試失敗應在最快的階段擋下，不必等 build |
| evidence    | 待填：PR 上 verify job 含 unit test 步驟的綠燈 Actions 連結                                       |
| next_action | Task 17 Verification                                                                              |

**Files:**

- Modify: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: Task 10 的 `npm run test:unit`
- Produces: 無

- [ ] **Step 1: 追加步驟**

`.github/workflows/ci.yml` 的 `verify` job，在 `Lint` 與 `Build` 之間插入：

```yaml
- name: Unit tests
  run: npm run test:unit
```

- [ ] **Step 2: 本機預演**

Run: `npm run test:unit`
Expected: 全部通過

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: run vitest unit tests in verify job"
```

---

### Task 17: Verification（獨立階段 — 不可省略）

| 欄位        | 值                                                                    |
| ----------- | --------------------------------------------------------------------- |
| stage       | verification                                                          |
| status      | pending                                                               |
| summary     | 端到端驗證整套測試基礎建設：全綠、可偵測真實回歸、CI 正常運作、不誤擋 |
| evidence    | 待填：各項實測輸出                                                    |
| next_action | Task 18                                                               |

**Files:** 無

- [ ] **V1 — 全套通過**

Run:

```bash
export PATH="$HOME/.nvm/versions/node/v22.15.1/bin:$PATH" \
  && npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -v TS6305 \
  && npm run lint && npm run test:unit && npm run build && npx playwright test
```

Expected: tsc 零輸出、lint 通過、unit 全綠、build 成功、E2E 雙引擎全綠

- [ ] **V2 — 突變測試：確認 E2E 真的能抓到 hydration 汙染**

暫時把 `src/app/[userCode]/list/[id]/page.tsx` 的 `sanitized` 還原為直接使用 `listResponse`（即重新引入已修的 bug）：

```ts
queryClient.setQueryData(listsKeys.infiniteIdeas(id), {
  pages: [toTsRestEntry(listResponse)],
  pageParams: [0],
});
```

Run: `npx playwright test e2e/specs/like-identity.spec.ts --project=mobile-chrome`
Expected: **E1 與 E1b 失敗**（證明測試有效）

還原改動：`git checkout "src/app/[userCode]/list/[id]/page.tsx"`，重跑確認回綠。

- [ ] **V3 — 突變測試：確認 unit 能抓到 offset 回歸**

暫時把 `src/hooks/api/ideas/offset.ts` 的 `computeNextOffset` 改為 `return lastPageSize;`

Run: `npx vitest run src/hooks/api/ideas/offset.test.ts`
Expected: **「keeps advancing on the third page」失敗**

還原：`git checkout src/hooks/api/ideas/offset.ts`，重跑確認回綠。

- [ ] **V4 — 煙霧層 skip 行為**

Run: `npx playwright test --project=smoke`（不帶任何 `E2E_*` 環境變數）
Expected: 5 skipped、0 failed

- [ ] **V5 — 穩定度（防 flaky）**

Run: `npx playwright test --project=mobile-chrome --repeat-each=3`
Expected: 全綠。任何間歇失敗必須在此修掉 —— flaky 測試比沒有測試更糟

- [ ] **V6 — CI 實跑**

推分支開 PR，確認 `verify` 與 `e2e` 兩 job 皆綠，且 Playwright report artifact 有成功上傳。

- [ ] **V7 — 手測清單覆蓋率盤點**

對照 [docs/handoff/2026-07-31.md](../../handoff/2026-07-31.md) 第五節的 8 項手測清單，逐項標記「已自動化 / 仍需手測」，結果填入 evidence。**預期已自動化：like 汙染、offset 分頁、private list、匿名 gating；仍需手測：ListSelector 完整流程、reorder 拖曳、profileImage 顯示、個人頁 infinite lists。**

---

### Task 18: Delivery（獨立階段 — 不可省略）

| 欄位        | 值                                                    |
| ----------- | ----------------------------------------------------- |
| stage       | delivery                                              |
| status      | pending                                               |
| summary     | 合流、文件更新、後續維護節點交代                      |
| evidence    | 待填：PR 連結 + ARCHITECTURE.md diff + 回填後的本計劃 |
| next_action | 無（計劃終點；後續節點見下方「維護節點」）            |

**Files:**

- Modify: `docs/ARCHITECTURE.md`（§13 測試項、§3 目錄結構、維護紀錄）
- Modify: 本計劃檔（回填全部 task 的 status / evidence）

- [ ] **Step 1: 更新 ARCHITECTURE.md §13 測試項**

把 §13 的「**測試**：完全缺失（沒有 unit / e2e 套件設定）。」替換為：

```markdown
- **測試**：**【✅ 已建立 — 2026-07-31】** Playwright E2E（`e2e/`，mobile-chrome + mobile-safari 雙 project）+ Vitest 單元測試（`src/**/*.test.ts`）。
  - **E2E 架構**：本地 mock API server（`e2e/mock-server/`）依 `Authorization` header 分歧回應，因為 **Server Component 的 SSR fetch 走 Node 端，Playwright 的 `page.route()` 攔不到**——這是重現 §13.1 hydration 汙染的唯一方法。
  - **繞過 Google OAuth**：storageState 直接注入 `auth-storage` / `user-storage`（見 `e2e/fixtures/auth.ts`），**絕不自動化 Google 登入 UI**。
  - **煙霧層**：5 條打真 dev BE，靠 `E2E_ACCESS_TOKEN` 等 secret 啟用；secret 缺席時自動 skip 而非 red。
  - **可測性改動**：`src/lib/seo/fetchers.ts` 的 revalidate 改為 `SEO_FETCH_REVALIDATE` 環境變數驅動（預設仍 300，prod 行為不變）。
  - **選擇器契約**：`data-testid` + `data-liked` / `data-following` / `data-idea-id` / `data-list-id`。**新增 UI 時請一併補**，否則 E2E 無法斷言。
- **Storybook**：尚未引入，元件文件靠 README + 程式碼。
```

（原本的「Storybook」條目若已存在於別處，刪除重複的那一條）

- [ ] **Step 2: 更新 ARCHITECTURE.md §3 目錄結構**

§3 的目錄樹已過期（仍描述 `hooks/queries/` 為死碼、`mutations/useLikeAction.ts` 仍在）。套用兩處修正：

把 `├── queries/          # 【死碼】舊版 axios query hooks，已**零引用**，待刪（見 §13）` 及其下的 `│   └── infinite/` 一行，替換為：

```
│   ├── queries/publish/  # useCheckCreateQuota（命令式額度查詢，見 §4.6）+ cachesUpdater + quota.ts
```

把 `├── mutations/        # 大多為死碼...` 至 `│   └── optimisticUpdateHandler.ts ...` 三行替換為：

```
│   ├── mutations/        # 點擊型社交動作編排（樂觀更新 + 防抖，見 §4.4）
│   │   ├── followUnfollow/    # useFollowAction + cache updaters + schema
│   │   └── optimistic/        # 共用 infra（debounceRegistry / optimisticUpdateHandler）+ likeUnlike/
```

並在目錄樹頂層（`src/` 同層）追加：

```
e2e/                      # Playwright E2E：mock-server / fixtures / specs / smoke
playwright.config.ts
vitest.config.ts
```

- [ ] **Step 3: 更新維護紀錄**

`docs/ARCHITECTURE.md` 檔尾維護紀錄追加一行：

```markdown
- 2026-08-XX：建立測試基礎建設 —— Playwright E2E（mock API server 依 Authorization 分歧、storageState 繞過 Google OAuth、mobile 雙 project）+ Vitest 單元測試（offset / cache helper / path matcher / zod 契約 / 額度 / like store）+ GitHub Actions CI（tsc / lint / unit / build / e2e）。§13 測試項與 §3 目錄結構同步更新。計劃稿見 `docs/superpowers/plans/2026-07-31-test-infrastructure.md`。
```

（`XX` 於實際合併日填入）

- [ ] **Step 4: 回填本計劃全部欄位**

每個 task 的 `status` → `done` / `skipped`，`evidence` 填實測輸出。Task 8 若因 BE fixture 未就緒而未完成，標 `skipped` 並於 evidence 註明阻塞原因。

- [ ] **Step 5: Commit 並開 PR**

```bash
git add docs/ARCHITECTURE.md docs/superpowers/plans/2026-07-31-test-infrastructure.md
git commit -m "docs: record test infrastructure in architecture guide"
git push
```

以 `dev` 為 base 開 PR，標題 `test: add e2e and unit test infrastructure`。

- [ ] **Step 6: 合併後確認**

確認 `dev` 分支上 CI 綠燈，且 Actions 的 e2e job 在後續 PR 上正常運作。

---

## 維護節點

| 時點           | 事項                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------- |
| 合併後首週     | 觀察 CI e2e job 執行時間；若超過 10 分鐘，考慮把 mobile-safari 移到 nightly 排程          |
| 合併後 + 30 天 | 檢查煙霧層是否因 token 過期長期 skip；若是，正式向 BE 提方案 A（`POST /auth/test-token`） |
| 每次新增 UI    | 補 `data-testid`（見 §13 選擇器契約）                                                     |

---

## 風險備忘

1. **`e2e/` 未納入 `tsconfig.app.json` 的 `include`（只含 `src`）** —— e2e 檔案不受主要 type check 涵蓋。Playwright 執行時由 `tsx` 即時編譯，型別錯誤會在跑測試時才浮現。若要提前攔截，可另建 `tsconfig.e2e.json` 並加進 CI；本計劃暫不做（YAGNI）。
2. **mock server 與真 BE 漂移** —— 確定性層測的是 mock 行為，BE 改契約時這 80% 不會變紅。**煙霧層 S5 的欄位斷言是唯一防線**，故煙霧層長期 skip 會實質削弱整套測試價值（見維護節點 +30 天）。
3. **Task 3 的 `data-*` 屬性會進 production DOM** —— 體積影響可忽略（每個屬性數十 bytes），但屬公開可見資訊；請確認 `data-list-id` / `data-idea-id` 不含敏感資料（目前皆為既有的公開 id，安全）。
4. **Task 15 可能揭露真 bug**（`clearAllLikeStatus` 未清 `confirmedLikeMap`）—— 若成立，修復屬本計劃範圍內，已在該 task 的 ⚠️ 標註處理方式。
5. **`webServer` 於 CI 使用 `npm run start`（production build）** —— 與 dev 模式行為不同（無 Strict Mode 雙 mount）。這是刻意選擇：production 行為才是要保護的對象，且避免 §13.3 記載的 Strict Mode 雙打干擾斷言。
6. **Playwright 首次安裝瀏覽器約 400MB** —— CI 每次 `npx playwright install` 會耗時；若成為瓶頸，改用 `actions/cache` 快取 `~/.cache/ms-playwright`。
7. **`build` 與 `webServer` 的 `npm run start` 曾各自持有不同的環境變數，導致 build-time 與 runtime 的 `SEO_FETCH_REVALIDATE` 不一致**（2026-08-13 實測發現）—— `next build` 在未設定 `SEO_FETCH_REVALIDATE` 時，會以預設的 `revalidate: 300` 將 `/[userCode]/list/[id]` 預渲染成 static 頁；但 runtime 的 `webServer.env` 設定 `SEO_FETCH_REVALIDATE=0`，迫使該路由變成 dynamic，Next 因此丟出 `Error: Page changed from static to dynamic at runtime /discovery`，導致頁面渲染失敗、E2E 斷言拿不到內容（4 個 spec fail）。修復方式：新增 `build:e2e` script，內嵌與 `webServer.env` 完全相同的四個環境變數並透過既有 `build` script 執行（保留 Lingui 步驟）；`webServer` 的 `command` 改為 `npm run build:e2e && npm run start`，讓 build 與 start 永遠共用同一組環境變數，並將 `timeout` 提高到 `240_000` 以涵蓋 build 時間。驗證：`rm -rf .next` 後重跑 `like-identity.spec.ts` + `follow-identity.spec.ts`（mobile-chrome）由 4 failed 轉為 9 passed，且 log 不再出現 static-to-dynamic 錯誤。
8. **`fullyParallel` 已改為 `false`、`workers` 固定為 `1`**（2026-08-14 review 發現）—— 所有 worker 共用同一個跑在 4000 埠的 mock-server process，其 fixture 狀態是 `e2e/mock-server/state.ts` 裡的單一 module-level 物件；每個測試的 `beforeEach` 都會 POST `/__test__/reset` 來重新賦值這個共享物件。目前尚未爆炸純屬僥倖：現有測試沒有任何一個「成功」的 mutation（匿名點讚會先收到 401，狀態根本沒被改到）。一旦之後加入會刪除 idea 並斷言結果的 spec，某個 worker 的 `beforeEach` reset 就可能插入另一個 worker 測試的執行過程中，產生間歇性失敗。Per-worker 狀態隔離在此不可行：頁面導覽會觸發 Next.js server process 發出的 Server Component fetch，這些請求無法帶上 per-worker header，導致瀏覽器端與 SSR 端永遠無法就「該用哪個 worker 的狀態」達成一致。因此將確定性 E2E 跑法序列化（`fullyParallel: false` + `workers: 1`），並在 `playwright.config.ts` 加上註解說明理由 —— 之後不要為了「優化」而把 worker 數調高，那會重新引入間歇性失敗。
9. **`notFound()` 在 `/[userCode]/list/[id]` 路由下解析到的是路由範圍的 `src/app/[userCode]/list/[id]/not-found.tsx`，而不是根層的 `src/app/not-found.tsx`**（2026-08-15 修 E7 時發現）—— 兩者文案不同（分別是「We couldn't find this page.」與「Oops something is wrong!」），且都包在 Lingui `<Trans>` macro 內、屬於會隨語系切換的翻譯文案（en / zh-TW 都要支援），不能拿來做斷言依據；`We couldn't find this page.` 裡的撇號還是全形 `'`（U+2019）不是 ASCII `'`，直接字串比對很容易誤植而永遠比不中。修法是在兩個 not-found 元件的最外層元素都加上 `data-testid="not-found"`，讓 E2E 斷言與語系、文案內容脫鉤；之後任何新增的路由範圍 not-found 元件都要記得補上同一個 testid。

10. **`page.mouse.wheel` 在 mobile WebKit 不支援** —— Playwright 於 mobile-safari 會拋 `Mouse wheel is not supported in mobile WebKit`。無限捲動測試改用 `locator.last().scrollIntoViewIfNeeded()` 觸發 IntersectionObserver sentinel，並以 `expect.poll` 等待列數成長取代固定 `waitForTimeout`（2026-08 實測）。
