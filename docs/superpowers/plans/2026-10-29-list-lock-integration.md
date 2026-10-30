# 名單上鎖串接 Implementation Plan

> **For agentic workers:** 用 superpowers:executing-plans 逐階段執行。每個階段開始前，先確認「待確認事項」已有答案。所有 ⚠️ 標記的項目都是推測，必須等用戶確認才可實作。

**Goal:** 收尾 `feature/new-list-type` 的現有改動，並完成「建立名單」的上鎖功能（UI → form → API）。編輯名單、題目歷史與回答、讀者解鎖也都在本分支完成（Q8）；需要設計稿的部分等稿到了再做。

**Branch:** `feature/new-list-type`，base 為 `dev`。

**API 文件:** [docs/api/2026-10-17-list-lock-mock.md](../../api/2026-10-17-list-lock-mock.md)

## Global Constraints

- 型別檢查用 `npm run tsc`，不要用 `tsc -p .`。Shell 先切到 Node 22.23.4。
- 跑 e2e 前，要先確認 8080 **沒有** dev server。`reuseExistingServer` 會讓測試接到真 BE，結果無效。
- 使用者看得到的字串一律用 `t` / `<Trans>`。
- 子元件放在元件資料夾內，用 PascalCase 資料夾，不建巢狀 `_components`（ARCHITECTURE §13 #8）。
- 動畫用 `motion-safe:`，並處理焦點（ARCHITECTURE §8）。
- Commit 由用戶要求才做；訊息結尾附：
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  ```

## 現況（2026-10-29）

- `npm run tsc` 沒有錯誤。`npm run lint` 為 0 error / 27 warning。
- #8 攤平已由用戶完成：`Form/_components`、`ListCard/_components` 已不存在。
- `messages.po` 的來源路徑仍是舊的 `_components/` 路徑。
- ARCHITECTURE §13 #8 仍寫「剩 `ListCard/_components` 待處理」，§3 目錄樹也未更新。
- 上鎖功能只有 UI 骨架：
  - `PasswordConfigSection` / `QuestionConfigSection` 沒有 state。
  - `ListFormSchema` 沒有 `lock`。
  - 沒有 `/creator/*` 的 contract、hook，e2e mock 也沒有這些路由。
- 8080 目前有 dev server 在跑（PID 79108）。
- 尚未 commit：36 個檔案修改，另有多個未追蹤的新檔案。

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

---

## 階段 1：收尾目前改動

- **stage**：1 收尾
- **status**：✅ 完成（2026-10-30）
- **summary**：
  0. （用戶追加）相對路徑 import 改成 `@/`：範圍是 `Form/` 11 處與 `hooks/api` 19 處，`src/api/{contracts,schemas}/index.ts` 的 barrel 不改。另在 `eslint.config.mjs` 加 `no-restricted-imports` 擋 `./*`、`../*`，barrel 兩個檔案例外。
  1. 執行 `npm run extract`，更新 `.po` 的來源路徑。
  2. 更新 ARCHITECTURE：§3 目錄樹改成攤平後的結構；§13 #8 標 ✅；新增維護紀錄。
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
  - 第 2 步：ARCHITECTURE 已更新以下段落：
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
- **next_action**：開始階段 2（等用戶指示）。

## 階段 2：上鎖資料流設計

- **stage**：2 設計
- **status**：⬜ Q2、Q2b、Q5 已確認，等用戶同意開工；Q1 等設計稿（不影響本階段）
- **summary**：
  - 依 Q2 / Q2b：`ListFormSchema` 只新增 `lock`，規則照 BE §5 第 133–135 行；其他欄位不動。
  - 設定頁用暫存 state，按「完成」才 `setValue('lock', …)`，取消就丟掉暫存。
  - `isLocked` 不另存 state，改由 `lock.method !== ListLockMethod.NONE` 推算。
  - 預設值為 `{ method: ListLockMethod.NONE }`。
  - schema 草案：
    ```ts
    lock: z.discriminatedUnion('method', [
      z.object({ method: z.literal(ListLockMethod.NONE) }),
      z.object({ method: z.literal(ListLockMethod.PASSWORD) }),
      z.object({
        method: z.literal(ListLockMethod.QUESTION),
        question: z.string().refine((s) => {
          const n = [...s.trim()].length;
          return n >= 1 && n <= 60;
        }),
      }),
    ])
    ```
  - 問答題目的長度以 code point 計算（`[...s.trim()].length`），範圍 1～60（BE §5）。
  - 上鎖與隱藏互斥：選隱藏時，`lock` 設為 `{ method: 'none' }`。
- **evidence**：
  - BE 文件 §5 第 133–137 行。
  - `LockConfigFakePage` 目前沒有 `useState` 或 `Controller`。
- **next_action**：實作 schema；同步更新 ARCHITECTURE §13「名單上鎖 API 串接」。

## 階段 3：建立名單的上鎖 UI 與 form

- **stage**：3 UI
- **status**：⬜ 等階段 2
- **summary**：
  - `QuestionConfigSection`：輸入框、字數計數、錯誤訊息。
  - `PasswordConfigSection`：維持現狀，等設計稿（Q1）。按「完成」時寫入 `{ method: 'password' }`。
  - `VisibilityFields`：`isLocked` 改由 form 推算（Q2）。
  - 摘要文字維持現狀，等設計稿（Q6）。
  - `LockTypeDrawer` 的寫死中文改成 `<Trans>`。
  - 新元件補上 testid。
- **evidence**：API 文件 FE 備註「UI 待補」第 1、2 點。
- **next_action**：新增 e2e：
  - V7：問答題目超過 60 字或空白時，無法完成。
  - V8：按「完成」後 form 值正確；取消後 form 值不變。

## 階段 4：建立名單 API 串接

- **stage**：4 串接
- **status**：⬜ 等階段 3。依 Q3：只做 contract、hook、單元測試，create 頁暫不切換；切換等 Q9
- **summary**：
  - 新增 `/creator/lists` 的 zod schema 和 ts-rest contract。先做 `POST /creator/lists` 和 `GET /creator/lists/:listId`。
  - 加上 `Idempotency-Key` header（Q5）：同一份內容重送沿用同一個 key；表單內容改變後換新 key。
  - 送出前把 form 值轉成 BE request（Q2b：轉換放在送出端，不改 schema）：
    - 不送 `null` 或未知欄位。
    - `coverImage: null` 改成省略。
    - `categoryID: 0` 改成省略。
    - title 去掉首尾空白。
    - `lock.method === 'none'` 時可以省略 `lock`。
  - 新增 `usePostCreatorList` hook。
  - e2e mock server 新增 `/creator/lists` 路由。
  - Vitest：zod contract 能正確 parse 三種 method 的 request 和 response。
- **evidence**：BE 文件 §1 Headers、§5、§6、§13 錯誤處理。
- **next_action**：Q9 由用戶問 BE。

## 階段 5：編輯名單

- **stage**：5 編輯
- **status**：⬜ 等階段 4 與 Q7
- **summary**：
  - 編輯流程：先 GET 編輯設定並保存 `editToken`，再 PATCH。
  - `resetReadPermissions`：PATCH 有帶 `lock` 時為必填。
  - 密碼名單：顯示密碼與名額，並提供 `increase-capacity`（名額 +10）。
- **evidence**：BE 文件 §6、§7、§8；FE 備註「UI 待補」第 3 點。
- **next_action**：等設計稿（Q7）。

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
  - `prettier/prettier` 沒有生效：config object 被註冊成 plugin（ARCHITECTURE §11）。
  - #7 圖片放置規則。
  - #9 Provider 位置。
- **evidence**：ARCHITECTURE §13。
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
  - 每次交付都附驗證結果，並更新 ARCHITECTURE §13 和維護紀錄。
- **evidence**：commit hash；開 PR 時附 PR 連結與 CI 結果。
- **next_action**：階段 4 完成後，詢問用戶是否開 PR。
