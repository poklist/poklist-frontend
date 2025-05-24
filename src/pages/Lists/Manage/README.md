以下是叫Ai產的，只是留作方向，不負任何TODO責任

# ListManagePage 重構建議

此文件整理了 `ListManagePage.tsx` 的重構建議，目的是提升可讀性、模組化程度與維護性。

## 📁 組件拆分建議

為了簡化主元件結構，建議拆分成以下子元件：

| 子元件名稱            | 負責內容                        |
| --------------------- | ------------------------------- |
| `ListManageHeader`    | 標題與刪除清單邏輯              |
| `ListManageActions`   | 「編輯封面」與「新增 Idea」按鈕 |
| `ListManageEmptyHint` | 根據清單是否為空顯示提示文字    |
| `IdeaReorderFooter`   | 負責關閉與儲存順序的 Footer     |

---

## 🔌 自定義 Hook 抽離

可將頁面中的狀態與邏輯集中到一個 hook 中，例如 `useListManage`，集中管理以下內容：

- `ideasDraft` 與 `isOrderModified` 狀態邏輯
- `reorderIdeas` 重排與順序轉換邏輯
- `deleteList` / `navigateTo` 等行為處理
- 所有 `withAuth` 包裝邏輯

---

## 🧠 命名與語意優化

建議將部分命名調整為更具語意的一致格式：

| 原命名            | 建議命名                     | 理由               |
| ----------------- | ---------------------------- | ------------------ |
| `atEditList`      | `handleEditList`             | 統一事件處理風格   |
| `ideasDraft`      | `orderedIdeasDraft`          | 更明確指出用途     |
| `onBottomReached` | `handleLoadMoreIdeas`        | 說明是載入更多資料 |
| `data`            | `listData` / `listQueryData` | 提升語意清晰度     |

---

## 🚦 使用者體驗與邏輯建議

- 建議將 `setIsLoading` 包裝為 `useMemo` 計算 `isBusy` 狀態。
- `isDeleting` 可考慮用 `isDeleteListLoading` 取代。
- 若 `id` 為必要條件，應在進入頁面即導向錯誤頁。
- 拖曳排序完成後可考慮自動儲存（選項性功能）。

---

## ✅ 維護性與測試建議

- 卸載時清除 `ideasDraft` 狀態避免殘留。
- 抽離的邏輯應新增單元測試，特別是：
  - `reorderIdeas` 的順序合併邏輯
  - `withAuth` 的包裝行為

---

如需協助拆分元件或 hook，我們建議先從 [`ListManageActions`](f) 開始，作為重構起點。
