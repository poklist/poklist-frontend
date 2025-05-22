# 函數式編程工具

此文檔描述了專案中用於支持函數式編程風格的工具和工具函數。這些工具旨在讓代碼更具可讀性、可測試性和可維護性。

## 工具概述

### `@/lib/functional.ts`

提供了通用的函數式編程工具：

- `compose`: 從右到左組合多個函數
- `pipe`: 從左到右組合多個函數
- `when`: 創建一個函數，只在滿足條件時執行原函數
- `curry`: 柯里化，將多參數函數轉換為嵌套的單參數函數
- `partial`: 偏應用，預先填充函數的部分參數
- `memoize`: 記憶化，緩存函數結果以避免重複計算
- `throttle`: 節流，限制函數在一定時間內只執行一次
- `debounce`: 防抖，延遲函數執行，在延遲時間內再次調用則重新計時

### `@/hooks/useAuth.ts`

提供認證相關的函數式工具：

- `useAuthCheck`: 檢查用戶是否已登入，未登入時打開登入對話框
- `useAuthProtect`: 保護函數，確保只有登入用戶才能執行
- `useAuthPipe`: 組合多個函數，並加上登入保護
- `useConditionalExecution`: 條件執行函數，更通用的條件判斷工具
- `useAuthWrapper`: 更靈活的身份驗證包裝器，支持更多自定義行為

## 使用示例

### 基本用法

```tsx
// 導入所需工具
import { useAuthProtect } from '@/hooks/useAuth';

const MyComponent = () => {
  // 獲取保護函數
  const { protect } = useAuthProtect();

  // 定義需要保護的函數
  const handleSensitiveAction = protect(() => {
    // 只有已登入用戶才能執行的代碼
    performSensitiveOperation();
  });

  return <button onClick={handleSensitiveAction}>執行敏感操作</button>;
};
```

### 高級用法

```tsx
// 導入所需工具
import { useAuthWrapper } from '@/hooks/useAuth';
import { pipe } from '@/lib/functional';

const MyComponent = () => {
  // 更靈活的身份驗證包裝器
  const { withAuth } = useAuthWrapper({
    onNotAuthorized: () => showCustomLoginUI(),
    beforeExecution: () => trackAnalytics('action-attempted'),
    afterExecution: (result) => console.log('操作結果:', result),
  });

  // 定義操作步驟
  const validateData = (data) => {
    /* ... */
  };
  const transformData = (data) => {
    /* ... */
  };
  const submitData = (data) => {
    /* ... */
  };

  // 組合並保護函數
  const handleSubmit = withAuth((data) => {
    // 使用 pipe 組合多個函數
    return pipe(validateData, transformData, submitData)(data);
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(formData);
      }}
    >
      {/* 表單內容 */}
    </form>
  );
};
```

## 最佳實踐

1. **優先使用函數式風格**：盡量使用不可變數據和純函數，使代碼更易於理解和測試。

2. **分離關注點**：將業務邏輯與權限檢查分離，使用高階函數進行組合。

3. **重用而非重複**：利用函數組合和工具函數避免代碼重複。

4. **保持函數簡單**：讓每個函數只做一件事，通過組合實現複雜功能。

5. **一致性**：在整個代碼庫中使用一致的模式和工具，提高可讀性。

6. **考慮性能**：適當使用 `memoize`、`throttle` 和 `debounce` 等工具優化性能。

## 在 React 和 TypeScript 中的應用

函數式編程模式特別適合 React 和 TypeScript 環境：

- **React 組件**：將 UI 渲染視為純函數，根據 props 和 state 計算輸出。
- **Side Effects**：使用組合函數處理副作用，保持組件邏輯清晰。
- **TypeScript 類型安全**：利用泛型確保函數組合和高階函數的類型安全。

## 何時使用

1. 當需要將同樣的邏輯應用於多個不同地方時（如登入檢查、數據驗證）
2. 當存在可以分解為更小、更專注功能的複雜操作時
3. 當需要延遲執行或條件執行某些操作時
4. 當需要更清晰地分離業務邏輯和橫切關注點（如認證、日誌記錄）時

通過這些工具和最佳實踐，我們可以在 React 函數組件中實現類似裝飾器的功能，同時保持代碼的簡潔和可維護性。
