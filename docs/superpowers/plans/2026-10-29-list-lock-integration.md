# 名單上鎖串接 Implementation Plan

> **For agentic workers:** 用 superpowers:executing-plans 逐階段執行。每個階段開始前，先確認「待確認事項」已有答案。所有 ⚠️ 標記的項目都是推測，必須等用戶確認才可實作。

**Goal:** 收尾 `feature/new-list-type` 的現有改動，並完成「建立名單」的上鎖功能（UI → form → API）。編輯名單、題目歷史與回答、讀者解鎖也都在本分支完成（Q8）；需要設計稿的部分等稿到了再做。

**Branch:** `feature/new-list-type`，base 為 `dev`。

**API 文件:** [docs/api/2026-10-17-list-lock-mock.md](../../api/2026-10-17-list-lock-mock.md)

## Global Constraints

- 型別檢查用 `npm run tsc`，不要用 `tsc -p .`。Shell 先切到 Node 22.23.4。
- 跑 e2e 前，要先確認 8080 **沒有** dev server。`reuseExistingServer` 會讓測試接到真 BE，結果無效。
- 使用者看得到的字串一律用 `t` / `<Trans>`。
- 子元件放在元件資料夾內，用 PascalCase 資料夾，不建巢狀 `_components`（AGENTS §13 #8）。
- 動畫用 `motion-safe:`，並處理焦點（AGENTS §8）。
- Commit 由用戶要求才做；訊息結尾附：
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  ```

## 現況（2026-10-30 更新）

- 2026-11-02 的 commit（皆未 push）：
  - `053c156` feat：用戶 10/30 的 UI 改動。依用戶要求，不加 Claude 署名。
  - `569e3cc` feat：階段 2，lock schema。
  - docs commit：文件更新，並把 `docs/ARCHITECTURE.md` 改名為 `docs/AGENTS.md`。；之後用戶再把它搬到 repo 根目錄 `AGENTS.md`（2026-11-02）
  - C1、C2 都在暫時的 worktree 單獨驗證過 tsc、lint、unit。
- 2026-11-03 的 commit（皆未 push）：
  - `53d5a00` feat：階段 3，上鎖設定寫進表單。依用戶要求，`common.test.ts` 的 prettier 格式併在這個 commit。
  - `84e191a` feat：階段 3.5，feature toggle 和 flags-off e2e build。
  - docs commit：`AGENTS.md` 搬到根目錄，記錄階段 3、3.5。
  - 每個 commit 都在暫時的 worktree 單獨驗證過 tsc、lint、unit。e2e 在 commit 前的同一份內容上跑過：81 passed。
- 2026-11-03 階段 4 的 commit（皆未 push）：
  - `26b74be` refactor：抽出 `applyCreatedListToCaches`，行為不變。
  - `c61a14e` feat：建立名單接上 `POST /creator/lists`，由 `FEATURES.listLock` 切換。
  - docs commit：記錄階段 4。
  - 每個 commit 都在暫時的 worktree 單獨驗證過 tsc、lint、unit（C8：64 passed；C9：72 passed）。e2e 83 passed，當時字數 `n/60` 是隱藏的，這是和 commit 內容唯一的差異。
- 階段 1 已完成：5 個 commit（`559603a`..docs commit）。這些 commit 只在本機，尚未 push。
- `npm run tsc` 沒有錯誤；`npm run lint` 為 0 error / 27 warning（2026-10-30 在下列未 commit 改動上跑過）。
- 用戶在 commit 之後又有改動，目前尚未 commit：
  - `ResetTitleWarnDrawer`：title 已有內容時，套用範例主題前先確認是否取代。
  - 分類 pill 改成只在 `isEdit` 時顯示。
  - 上鎖的編輯模式骨架：`isEdit` 一路傳到 `LockConfigFakePage`。新增 `EditLockTypeDrawer`，「解除上鎖」尚未接上。
  - `DrawerIds` 新增兩個 ID；`DrawerComponent` 的關閉鈕改用 `IconClose`。
  - Lingui catalog 同步更新。
- 上述新 UI 沒有 e2e 覆蓋。2026-11-02 在這些改動上跑完整 e2e：72 passed，5 skipped（smoke），既有測試沒有被打壞。
- 上鎖資料尚未寫進 form：
  - `PasswordConfigSection` / `QuestionConfigSection` 沒有 state。
  - `ListFormSchema` 沒有 `lock`。
  - 沒有 `/creator/*` 的 contract、hook，e2e mock 也沒有這些路由。
- en 的 catalog 有 56 筆未翻譯。

## 待確認事項

| ID | 問題 | 預設建議 | 狀態 |
| --- | --- | --- | --- |
| Q1 | BE §5 規定建立名單時不接受自訂密碼或名額。建立時，密碼設定頁要顯示什麼？ | **等設計稿再決定**。`PasswordConfigSection` 先維持現狀。 | ✅ 2026-10-29 |
| Q2 | 上鎖設定存在哪裡？ | **放進 `ListFormSchema`**，欄位規則依 API 文件 §5 Request 欄位（第 123–135 行）。設定頁的暫存方式與 `isLocked` 推算見 Q2b。 | ✅ 2026-10-29 |
| Q2b | Q2 的「依第 123–135 行」是只套用在 `lock`，還是整個 `ListFormSchema` 都要對齊 BE 的 request 欄位？ | **只套用在 `lock`**。其他欄位不動：`categoryID` 為 0、`coverImage` 為 null、title 首尾空白等差異，在送出新 API 前轉換。舊 `/lists` API 和 Idea 表單不受影響。 | ✅ 2026-10-29 |
| Q3 | 新舊 API 切換時程未定，現在要怎麼做？ | **先做 contract、hook 和單元測試，create 頁先不切換**。等 BE 回覆後再切。 | ✅ 2026-10-29 |
| Q4 | 現有改動要怎麼 commit 和開 PR？ | **依主題分成 5 個 commit，不開 PR**，留在本分支和上鎖功能一起交付。 | ✅ 2026-10-29 |
| Q5 | 送出失敗後重試時，`Idempotency-Key` 要怎麼處理？ | **同一份內容重送沿用同一個 key；表單內容改變後才換新 key**。 | ✅ 2026-10-29 |
| Q6 | 上鎖後，底部摘要文字要不要顯示上鎖方式或題目？ | **等設計稿再決定**。摘要先維持現狀，只依公開或隱藏顯示。 | ✅ 2026-10-29 |
| Q7 | 編輯頁的 UI 依據是什麼？包括 `resetReadPermissions`、密碼顯示、名額 +10。 | **等設計稿**，到了之後在本分支做。 | ✅ 2026-10-29 |
| Q8 | 題目歷史、回答列表、讀者解鎖要另開分支嗎？ | **全部在本分支做**。 | ✅ 2026-10-29 |
| Q9 | 新舊 API（`/lists` ↔ `/creator/lists`）的切換時程？ | 由用戶詢問 BE。 | ⏳ 等 BE |
| Q10 | `ListFormSchema` 同時被舊 API 的 schema 使用，包括 `listPreviewSchema`、`postRequestSchema`、`putRequestSchema`，以及 `idea/create/list`。直接加 `lock` 會影響舊 API，要怎麼加？ | 拆成兩個：現有內容改名 `ListBaseSchema`，給舊 API 和 `idea/create/list` 用；`ListFormSchema = ListBaseSchema.extend({ lock })` 只給 list Form 用。送出舊 API 前去掉 `lock`。 | ✅ 2026-11-02 採預設 |
| Q11 | 草稿（localStorage `LIST_DRAFT`）會用 `ListFormSchema` parse，舊草稿沒有 `lock`。要怎麼相容？ | `lock` 加 `.default({ method: 'none' })`，舊草稿照常讀取，不 bump `STORAGE_VERSION`（bump 會清掉全部 localStorage）。 | ✅ 2026-11-02 採預設 |
| Q12 | 問答題目不合格（空白或超過 60 字）時，按「儲存設定」要怎麼反應？ | **按鈕 disabled**，只顯示 `n/60` 字數，不顯示錯誤文字。 | ✅ 2026-11-02 |
| Q13 | `isLocked` 改由 form 推算後，在選上鎖方式和設定的過程中，form 的 `lock` 還是 none，開關會顯示「關」。要維持現在「一打開就顯示開」的行為嗎？ | **按完成後才顯示開**：開關只看 `lock ≠ none`，設定過程中顯示「關」。V1 / V3 要改寫。 | ✅ 2026-11-02 |
| Q14 | 還原草稿時要不要還原 `lock`？目前連 `type` 也沒還原。 | **還原 `lock` 和 `type`**。 | ✅ 2026-11-02 |
| Q15 | 問答字數 `n/60` 要怎麼算？ | **和驗證一致**：去掉首尾空白後，以 code point 計算。 | ✅ 2026-11-02 |
| Q16 | `QuestionConfigSection` 的示意資料（「共 23 則回覆」「2 則未讀」「回覆列表」按鈕）在建立名單時也會顯示。要怎麼處理？ | **建立名單時顯示「共 0 則回覆」「0 則未讀」，「回覆列表」按鈕 disabled**；編輯時維持現有示意值，等階段 5 接 API。 | ✅ 2026-11-02 |
| Q17 | Feature toggle 要控制哪些東西？ | **通用 toggle 機制**（例如 `FEATURES = { listLock }`，之後可加更多開關）。目前主要用途：用 `listLock` 切換新舊 API，開發和測試上鎖功能。 | ✅ 2026-11-02 |
| Q18 | toggle 用什麼方式切換？ | **只用環境變數**（build 時決定）。 | ✅ 2026-11-02 |
| Q19 | e2e 和 CI 要怎麼處理 toggle？ | **e2e 開啟 toggle，另加關閉時的測試**。 | ✅ 2026-11-02 |
| Q20 | toggle 要在 commit C4～C6 之前還是之後做？ | **先做 toggle，再和 C4～C6 一起重新安排 commit**。 | ✅ 2026-11-02 |
| Q21 | `listLock` 關閉時，上鎖 UI 要不要顯示？（關閉時用舊 API，存不了 `lock`） | **顯示**：toggle 只切換 API，上鎖 UI 一律顯示。 | ✅ 2026-11-02 |
| Q22 | 環境變數在 build 時就寫死，要測「關閉」狀態需要第二次 build。關閉時的測試要怎麼做？ | **第二份 build + 另一個 port**：`distDir` 可用環境變數指定；Playwright 加一個 toggle 關閉的 webServer（port 8081）和專屬 project。 | ✅ 2026-11-02 |
| Q23 | 新 API 要到階段 4 才做，所以 toggle 目前沒有可切換的行為（開或關都送舊 `/lists`）。這個階段要做到哪裡？ | **只做機制和基礎設施**。開啟時走 `/creator/lists` 的部分在階段 4 接上。 | ✅ 2026-11-02 |
| Q24 | 用新 API 建立成功後要導向哪裡？BE mock 不會真的建立名單，`content.id` 固定回 fixture ID；舊的 `GET /lists/:id` 找不到它，所以接 dev BE 時會看到 not-found 頁。 | **和舊流程一樣 `viewList(id)`**。 | ✅ 2026-11-03 |
| Q25 | 計劃原本要同時做 `GET /creator/lists/:listId`，但建立流程用不到它，只有編輯（階段 5）會用。要現在做嗎？ | **延到階段 5**。 | ✅ 2026-11-03 |
| Q26 | 新 API 需要 `lock`，但目前 Form 送出前就用 `ListBaseSchema.parse` 去掉了。要改在哪裡處理？ | **交給呼叫端決定**：Form 傳完整表單值；建立頁依 `FEATURES.listLock` 轉換；編輯頁在階段 5 前一律用舊 API。 | ✅ 2026-11-03 |
| Q27 | 新 hook 建立成功後要怎麼更新快取？ | **比照 `usePostNewList`**。 | ✅ 2026-11-03 |

---

## 階段 1：收尾目前改動

- **stage**：1 收尾
- **status**：✅ 完成（2026-10-30）
- **summary**：
  0. （用戶追加）相對路徑 import 改成 `@/`：範圍是 `Form/` 11 處與 `hooks/api` 19 處，`src/api/{contracts,schemas}/index.ts` 的 barrel 不改。另在 `eslint.config.mjs` 加 `no-restricted-imports` 擋 `./*`、`../*`，barrel 兩個檔案例外。
  1. 執行 `npm run extract`，更新 `.po` 的來源路徑。
  2. 更新 AGENTS：§3 目錄樹改成攤平後的結構；§13 #8 標 ✅；新增維護紀錄。
  3. 用戶停掉 8080 的 dev server 後，跑完整 e2e（72 條）。
  4. 依 Q4 的答案 commit。預設分成 5 個：
     - `refactor: flatten nested _components`
     - `chore: unify eslint flat config`
     - `chore: remove dead files`
     - `feat: list visibility lock UI and animations`
     - `docs: list lock api doc and architecture`
- **evidence**：
  - 第 0 步：`grep` 確認 `src` 內除兩個 barrel 外已沒有相對路徑。用暫存檔驗證規則會對 `./`、`../`、`export * from './x'` 報 error，barrel 檔則不報。
  - 第 1 步：`.po` 內不再有 `_components/` 舊路徑。en 有 56 筆未翻譯。
  - 第 2 步：AGENTS 已更新以下段落：
    - §3：目錄樹；Component Folder Rules 新增第 5 條。
    - §11：`no-restricted-imports`。
    - §13：#8 標 ✅，§13.1 / §13.2 的連結路徑同步更新。
    - §15：絕對路徑規則。
    - 新增維護紀錄。
  - 第 3 步：8080 已確認空閒。結果如下：
    - `npm run test:e2e`：72 passed，5 skipped（smoke）。
    - `npm run test:unit`：55 passed。
    - `npm run tsc`：exit 0。
    - `npm run lint`：0 error / 27 warning。
  - 第 4 步：5 個 commit，依序為：
    - `559603a` refactor
    - `dbb2143` chore (eslint)
    - `e5f464a` chore (dead files)
    - `83aa2e2` feat
    - docs commit（本文件所在的 commit）
  - 用戶對未追蹤的舊文件（`docs/handoff/`、2026-07 與 2026-09-11 的 plans / specs、`.gcloudignore`）沒有偏好，因此沒有提交，維持未追蹤。
- **next_action**：
  - 用戶 2026-10-30 的新改動（見「現況」）需要決定怎麼 commit。
  - 開始階段 2 前要先跑完整 e2e，確認新改動沒有打壞既有測試。
  - 階段 2 等用戶指示。

## 階段 2：上鎖資料流設計

- **stage**：2 設計
- **status**：✅ 完成（2026-11-02，evidence 已補齊，未 commit）
- **summary**：
  - `src/types/common.ts` 的 schema 依 Q10 拆成三個：
    - `ListBaseSchema`：原本 `ListFormSchema` 的內容，舊 `/lists` API 的 schema（`api/schemas/lists.ts`）和 `idea/create/list` 改用這個。
    - `ListLockSchema`：依 `method` 區分（`z.discriminatedUnion('method', …)`）。question 先 `.trim()`，再以 code point 檢查長度 1～`LOCK_QUESTION_MAX_LENGTH`（60，放在 `constants/form.ts`）。
    - `ListFormSchema`：`ListBaseSchema.extend({ lock: ListLockSchema.default({ method: NONE }) })`，只給 list Form 用。依 Q11，舊草稿沒有 `lock` 也能讀取，不 bump `STORAGE_VERSION`。
  - `ListForm`：
    - `defaultValues` 加上 `lock: { method: NONE }`。舊 API 沒有 lock，所以編輯時一律從 none 開始。
    - `onSubmit` 改成 `completedCallback(ListBaseSchema.parse(data))`：zod 會移除 schema 未定義的 key，所以 `lock` 不會送到舊 API。切到 `/creator/lists` 後改送 lock（Q3）。
  - 留到階段 3：設定頁暫存 state、`isLocked` 改由 form 推算、選隱藏時把 `lock` 設成 none。
- **evidence**：
  - 新增 `src/types/common.test.ts`，7 個測試，先跑確認失敗，實作後通過。涵蓋：none／password、question trim、空白題目、60 個 emoji 通過但 61 個失敗（以 code point 計算）、question 缺漏、舊草稿 default、`ListBaseSchema` 會去掉 `lock`。
  - `npm run tsc` exit 0；`npm run lint` 0 error / 27 warning；`npm run test:unit` 62 passed（11 個檔案）。
  - 表單相關 e2e（list-create、list-edit、list-form-negative、list-form-expand、list-visibility）：34 passed。
  - 2026-11-02 複查，重新執行：
    - unit 62 passed，`common.test.ts` 7 項逐一 ✓。
    - `npm run tsc` exit 0；`npm run lint` 0 error / 27 warning。
    - `package.json` 的 version 未變（0.5.3），因此 `STORAGE_VERSION` 沒有 bump。
    - `grep`：`ListBaseSchema` 只用在 `api/schemas/lists.ts` 和 `idea/create/list/page.tsx`，其餘使用者都是 `ListFormSchema`。
    - 草稿讀取：讀程式確認 `getLocalStorage` 回傳的是 `safeParse` 的 `result.data`，會套上 `lock` 的 default。
  - ✅ 「`lock` 不會送到舊 API」（2026-11-02 補上）：
    - **為什麼要補**：mock server 的 `POST /lists`、`PUT /lists/:id` 只讀已知欄位，不檢查多餘欄位，所以原本 e2e 通過無法證明這件事。
    - **斷言**：`list-create.spec.ts` 和 `list-edit.spec.ts` 用 `page.waitForRequest` 攔截送出的 request，斷言 `body.title` 正確，且 body `not.toHaveProperty('lock')`。
    - **反向驗證**：暫時把 `onSubmit` 改成 `completedCallback(data)`（不去掉 `lock`）。兩個 spec 在 chrome 和 safari 共 4 個測試都失敗，log 顯示 `Received value: {"method": "none"}`。之後還原，用 `cmp` 確認檔案和備份完全相同。
    - **正向驗證**：完整 e2e 72 passed、5 skipped（smoke）；`npm run tsc` exit 0；`npm run lint` 0 error / 27 warning。
  - 附帶發現（不屬於階段 2）：`onRestoreDraft` 只還原 title、description、coverImage、externalLink、categoryID，不會還原 `type` 和 `lock`。階段 3 要決定草稿是否還原上鎖設定。
- **next_action**：階段 3，等用戶指示。

## 階段 3：建立名單的上鎖 UI 與 form

- **stage**：3 UI
- **status**：✅ 完成（2026-11-02；commit `53d5a00`）
- **summary**：
  - `QuestionConfigSection`：輸入框和字數計數。不顯示錯誤文字，題目不合格時「儲存設定」disabled（Q12）。
  - `PasswordConfigSection`：維持現狀，等設計稿（Q1）。按「完成」時寫入 `{ method: 'password' }`。
  - `QuestionConfigSection`：建立時回覆數為 0、「回覆列表」disabled（Q16）；字數以去掉首尾空白後的 code point 計算（Q15）。
  - 開關只看 form 的 `lock`（Q13）：打開開關只會改成公開並開 drawer，不改 `lock`；按「完成」才寫入 `lock`；關掉開關或選隱藏，`lock` 改成 none。`LockTypeDrawer` / `LockConfigFakePage` 的 `onCancel` 不再需要，移除。
  - 還原草稿時一併還原 `type` 和 `lock`（Q14）。
  - `VisibilityFields`：`isLocked` 改由 form 推算（Q2）。
  - 摘要文字維持現狀，等設計稿（Q6）。
  - `LockTypeDrawer` 的寫死中文改成 `<Trans>`。
  - 新元件補上 testid。
  - 已知缺口（等設計稿）：建立名單時，設定完成後沒有入口可以回到設定頁修改題目，只能把開關關掉再打開。
- **evidence**：
  - 先寫 e2e（V1 / V3 改寫、新增 V7～V10），在 mobile-chrome 跑：6 個 failed，原因都符合預期（開關仍為開、按鈕沒有 disabled、沒有字數、草稿沒有還原 `lock` / `type`）。
  - 實作後：`list-visibility` 在 chrome + safari 共 20 passed；完整 e2e 80 passed、5 skipped（smoke）。
  - `npm run tsc` exit 0；`npm run lint` 0 error / 27 warning；`npm run test:unit` 62 passed。
  - `npm run extract`：新增 `LockTypeDrawer` 的 `<Trans>` 文案。en 未翻譯 64 筆（原本 56 筆）。
  - 截圖（mobile-chrome，用暫時的 spec 拍攝，拍完已刪除）：
    - 設定頁：輸入題目後顯示 `7/60`、「儲存設定」可按；建立時顯示「共 0 則回覆」「0 則未讀」，「回覆列表」disabled。
    - 回到表單：開關為開、公開被選取。
    - 第一次截圖時「儲存設定」看起來是灰的，底部也還有 drawer。重拍確認是動畫還沒結束：按鈕 `isDisabled()` 為 false，drawer 在 DOM 中的數量為 0。
  - 實作時的判斷：
    - `getLocalStorage` 的型別推論把 `lock` 視為可省略，`useListDraft` 加上 `?? { method: none }` fallback。執行時 schema 的 default 一定會補上，這只是為了型別。
    - `onConfigDone` 現在經過 `onClosePage`。`onClosePage` 已不再呼叫 `onCancel`，只清掉暫存並關閉頁面，所以 `AGENTS.md` 舊的「不可經過 `onClosePage`」限制已不適用，已一併更新。
- **next_action**：階段 4（等用戶指示）。

## 階段 3.5：Feature Toggle（2026-11-02 用戶追加）

- **stage**：3.5 Feature Toggle
- **status**：✅ 完成（2026-11-02；commit `84e191a`）
- **summary**：
  - `src/constants/features.ts`：`FEATURES = { listLock }`，由 `NEXT_PUBLIC_FEATURE_LIST_LOCK` 控制，只有 `'true'` 算開啟（Q17、Q18）。目前沒有程式使用；階段 4 用它切換 `/lists` 和 `/creator/lists`。上鎖 UI 一律顯示（Q21）。
  - `.env.example` 新增這個變數（預設 `false`）。Dockerfile 和 Netlify 沒有設定，所以正式環境預設關閉。
  - `next.config.mjs`：`distDir: process.env.NEXT_DIST_DIR || '.next'`；`.gitignore` 加入 `.next-flags-off`。
  - `playwright.config.ts`：
    - 主 build（port 8080）開啟全部 toggle（`FEATURES_ON`）。
    - 新增第二個 webServer：toggle 全部關閉（`FEATURES_OFF`），`NEXT_DIST_DIR=.next-flags-off`，port 8081。
    - 新增 `flags-off` project（只跑 `e2e/flags-off/`）；`mobile-chrome` / `mobile-safari` 改成忽略 `e2e/flags-off/`。
  - `e2e/flags-off/list-lock-off.spec.ts`：F1，toggle 關閉時上鎖 UI 照常顯示，建立名單送舊 `/lists`，body 沒有 `lock`（Q19、Q22）。
  - CI 的 deterministic e2e 加上 `--project=flags-off`。
- **evidence**：
  - `src/constants/features.test.ts`，2 個測試：先跑確認失敗（模組不存在），實作後通過。
  - `npm run tsc` exit 0；`npm run lint` 0 error / 27 warning；`npm run test:unit` 64 passed。
  - 讀 Playwright 1.62.1 原始碼確認 plugin（webServer）setup 依序執行，所以兩份 build 不會同時跑 lingui extract。
  - 完整 e2e（用戶停掉 dev server 後，確認 8080、8081、4000 都空著才執行）：81 passed，其中 mobile-chrome 40、mobile-safari 40、flags-off 1（F1）。`.next/BUILD_ID` 和 `.next-flags-off/BUILD_ID` 都有產生，所以兩份 build 都跑過。
  - 第二份 build 的副作用：`next build` 會自動把 `.next-flags-off/types/**/*.ts` 加進 `tsconfig.json` 的 `include`，而且每次 build 都會加回去，所以把這行一起 commit。
  - `next start` 會印出「does not work with output: standalone」警告。原本的 8080 server 也有同樣的警告，測試結果不受影響。
  - 已知限制：`FEATURES.listLock` 目前沒有被使用，會被 tree-shake 掉（兩份 build 的 `static/` 都找不到 `listLock`），所以這個階段無法證明兩份 build 的 toggle 值不同。要到階段 4 才看得出來；F1 目前驗證的是「toggle 關閉的 build 能正常跑，而且走舊 API」。
- **next_action**：階段 4 接上新 API 時，用 `FEATURES.listLock` 切換，並讓開啟的 build 的 list-create / list-edit 改為斷言 `/creator/lists`。

## 階段 4：建立名單 API 串接

- **stage**：4 串接
- **status**：✅ 完成（2026-11-03；commit `26b74be`、`c61a14e`）
- **summary**：
  - `src/api/schemas/creatorLists.ts`：
    - `postRequest` 是 strict：BE 不接受 null 和未定義欄位。
    - `postResponse`：BE §5 的回應。
    - `idempotencyHeaders`：`idempotency-key` 不可為空字串。
    - `GET /creator/lists/:listId` 依 Q25 延到階段 5。
  - `src/api/contracts/creatorLists.ts`、`src/api/query/creatorLists.ts`：`POST /creator/lists` 的 contract 和 query client；兩個 barrel 加上 `creatorLists`。
  - `src/hooks/api/lists/toCreatorListPostRequest.ts`：表單值轉成 request：
    - title 去掉首尾空白。
    - `coverImage: null` 不送。
    - `categoryID: 0` 不送。
    - `lock` 為 none 時不送。
  - `src/lib/idempotency.ts`：`resolveIdempotencyKey`（Q5）。重送同一份內容沿用原 key，內容改變才換新 key；建立成功後清掉。
  - `src/hooks/api/lists/usePostCreatorList.ts`：新 hook，在 `mutate` 時自動帶 `Idempotency-Key`。
  - `src/hooks/api/lists/applyCreatedListToCaches.ts`：從 `usePostNewList` 抽出建立後的快取更新，新舊 hook 共用（Q27）。
  - Form 的 `completedCallback` 改傳完整表單值（Q26）：
    - 建立頁依 `FEATURES.listLock` 選擇 API：開啟時用 `toCreatorListPostRequest` 送新 API，關閉時用 `ListBaseSchema.parse` 送舊 API。
    - 編輯頁一律用 `ListBaseSchema.parse` 送舊 PUT。
  - 建立成功後導向 `viewList(id)`（Q24）。
  - e2e mock server：
    - 新增 `POST /creator/lists`：缺 `Idempotency-Key`、有 null 或未定義欄位時回 400；名單會真的存進 state。
    - CORS 允許 `Idempotency-Key` 和 `PATCH`。
  - `e2e/specs/list-create.spec.ts`：主 build 開啟 toggle，改為斷言 `POST /creator/lists`：body 沒有 null、`categoryID`、`lock`，並有 `idempotency-key` header。另新增問答上鎖的建立測試。
- **evidence**：
  - 單元測試先寫，跑過確認失敗（模組不存在），實作後通過：`toCreatorListPostRequest.test.ts` 5 個、`idempotency.test.ts` 3 個。
  - `npm run tsc` exit 0；`npm run lint` 0 error / 27 warning；`npm run test:unit` 14 檔、72 passed。
  - 完整 e2e（用戶停掉 dev server、確認 8080 / 8081 / 4000 都空著後執行）：83 passed，其中 mobile-chrome 41、mobile-safari 41、flags-off 1。
  - 兩份 build 的 toggle 值不同，第一次得到行為上的證明：開啟的 build（8080）`list-create` 斷言送 `POST /creator/lists` 並帶 `idempotency-key` header，通過；關閉的 build（8081）F1 斷言送 `POST /lists`，通過。
  - 發現：用戶曾在 `QuestionConfigSection` 的字數 `n/60` 加上 `hidden`（e2e 是在隱藏狀態下跑的，V7 仍通過，因為 `toHaveText` 不檢查元素是否可見）。2026-11-03 用戶已改回，檔案和 HEAD 相同，維持 Q12「顯示 `n/60`」。
- **next_action**：階段 5（等用戶指示）。

## 階段 5：編輯名單

- **stage**：5 編輯
- **status**：🟡 UI 骨架已由用戶開始（2026-10-30，未 commit）；資料流等階段 4
- **summary**：
  - 編輯流程：先 GET 編輯設定並保存 `editToken`，再 PATCH。
  - `resetReadPermissions`：PATCH 有帶 `lock` 時為必填。
  - 密碼名單：顯示密碼與名額，並提供 `increase-capacity`（名額 +10）。
  - 已有的骨架：
    - `isEdit` 由 `ListForm` 傳到 `VisibilityFields`，再傳到 `LockConfigFakePage`。
    - 「更換上鎖方式」會開 `EditLockTypeDrawer`。
    - 「解除上鎖」沒有 onClick。
    - `EditLockTypeDrawer` 的 `resetReadPermissions` RadioGroup 仍是註解，需要 form 有 `lock` 之後才能接（階段 2）。
- **evidence**：
  - BE 文件 §6、§7、§8；FE 備註「UI 現況與待補」。
  - `git diff`：`VisibilityFields`、`LockConfigFakePage`、`EditLockTypeDrawer`。
- **next_action**：其餘 UI 等設計稿（Q7）。`resetReadPermissions` 等階段 2 的 schema 完成後再接。

## 階段 6：題目歷史、回答、讀者解鎖

- **stage**：6 延伸
- **status**：⬜ 在本分支做（Q8），排在階段 5 之後；UI 需要設計稿
- **summary**：
  - 題目歷史與回答列表（§9～11，含分頁）。標已讀的 POST 用 `c.noBody()`。
  - 讀者解鎖（§12 `POST /lists/:id/unlock`）。
- **evidence**：BE 文件 §2 路由總表。
- **next_action**：階段 5 完成且有設計稿後開始。contract 和 hook 可先做，不需要等設計稿。

## 階段 7：技術債（低優先）

- **stage**：7 技術債
- **status**：⬜ 已記錄
- **summary**：
  - `prettier/prettier` 沒有生效：config object 被註冊成 plugin（AGENTS §11）。
  - #7 圖片放置規則。
  - #9 Provider 位置。
- **evidence**：AGENTS §13。
- **next_action**：有空檔再做，每項獨立 commit。

## 階段 8：Verification

- **stage**：8 Verification
- **status**：⬜ 每個階段結束都要做
- **summary**：
  - 確認 8080 沒有服務在跑：`lsof -iTCP:8080 -sTCP:LISTEN` 沒有輸出。
  - 依序跑：
    - `npm run tsc`
    - `npm run lint`（0 error）
    - `npm run test:unit`
    - `npm run test:e2e`（完整）
  - UI 改動用 preview 以 mobile 尺寸截圖確認。
  - 動畫檢查 reduced-motion（同 X2 的做法）。
- **evidence**：每個階段附上指令輸出摘要。
- **next_action**：從階段 1 第 3 步開始。

## 階段 9：Delivery

- **stage**：9 Delivery
- **status**：⬜
- **summary**：
  - 依 Q4：階段 1 分 5 個 commit 留在本分支，不單獨開 PR。
  - 上鎖功能完成後，整個分支一起交付到 `dev`。開 PR 的時機和範圍，到時再問用戶。
  - 每次交付都附驗證結果，並更新 AGENTS §13 和維護紀錄。
- **evidence**：commit hash；開 PR 時附 PR 連結與 CI 結果。
- **next_action**：階段 4 完成後，詢問用戶是否開 PR。
