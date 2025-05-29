# UI 元件庫

這個目錄包含所有基礎 UI 元件，是構建用戶界面的最小構建單元。這些元件設計為**純展示性**，不包含業務邏輯，並且可在整個應用中重複使用。

## 元件特點

- **無狀態** - 大多數基礎 UI 元件應是無狀態的，只通過 props 控制
- **純展示** - 不包含業務邏輯，不直接訪問應用狀態
- **高可訪問性** - 符合 WCAG 可訪問性標準
- **響應式** - 適應不同尺寸的螢幕和設備
- **可組合** - 設計為可輕鬆組合使用

## 元件概覽

### 交互元件

- `button.tsx` - 按鈕元件，支持多種尺寸和樣式變體
- `input.tsx` - 輸入框元件
- `textarea.tsx` - 文本區域元件
- `radio-group.tsx` - 單選按鈕組
- `slider.tsx` - 滑塊元件

### 容器元件

- `dialog.tsx` - 對話框元件
- `drawer.tsx` - 抽屉元件
- `toast.tsx` - 吐司通知元件
- `form.tsx` - 表單相關元件

### 展示元件

- `avatar.tsx` - 頭像元件
- `label.tsx` - 標籤元件

### 組織工具

- `icons/` - 圖標元件集合
- `containers/` - 特殊容器元件
- `wrappers/` - 包裝器元件

## 設計與實現

### 變體管理機制

基礎 UI 元件使用 `class-variance-authority (cva)` 來管理變體和條件式樣式：

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base-classes-here', {
  variants: {
    variant: {
      primary: 'primary-specific-classes',
      secondary: 'secondary-specific-classes',
    },
    size: {
      sm: 'small-size-classes',
      md: 'medium-size-classes',
      lg: 'large-size-classes',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

### 類名合併工具

使用 `cn` 工具函數合併類名：

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // 允許外部覆蓋
)}>
```

### Ref 轉發

所有基礎 UI 元件都應支持 ref 轉發，便於父元件操作 DOM：

```tsx
import * as React from 'react';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn(/* ... */)} {...props} />;
  }
);
Button.displayName = 'Button';
```

## 元件使用示例

### Button

```tsx
import { Button, ButtonVariant, ButtonSize } from '@/components/ui/button';

<Button
  variant={ButtonVariant.PRIMARY}
  size={ButtonSize.MD}
  onClick={handleClick}
>
  按鈕文本
</Button>;
```

### Dialog

```tsx
import { Dialog, DialogContent } from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>對話框內容</DialogContent>
</Dialog>;
```

### Toast

```tsx
import { useToast } from '@/hooks/useToast';

const { toast } = useToast();

// 顯示吐司通知
toast({
  title: '成功',
  description: '操作已完成',
  variant: 'success',
});
```

## 元件開發指南

### 新增元件的步驟

1. 在 `ui/` 目錄下創建新的 `.tsx` 文件
2. 使用 React.forwardRef 支持 ref 轉發
3. 為元件提供完整的 TypeScript 類型定義
4. 使用 cva 管理元件變體
5. 確保元件實現 aria 屬性以支持可訪問性

### 基礎元件模板

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const myComponentVariants = cva('base-styles', {
  variants: {
    // 定義變體
  },
  defaultVariants: {
    // 設置默認值
  },
});

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {
  // 定義其他屬性
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(myComponentVariants(props), className)}
        {...props}
      />
    );
  }
);
MyComponent.displayName = 'MyComponent';

export { MyComponent };
```

## 元件設計準則

1. **一致性** - 所有 UI 元件應遵循相同的 API 設計模式
2. **簡單性** - 盡量減少 props 數量，提供合理的默認值
3. **可重用性** - 避免特定業務邏輯，保持元件的通用性
4. **無副作用** - 基礎 UI 元件應避免產生副作用，如 API 調用

## 樣式指南

- 使用 Tailwind CSS 實現所有樣式
- 避免內聯樣式和特定於元件的 CSS 文件
- 通過 cva 和 cn 管理樣式，而不是條件語句
- 遵循項目整體設計系統，保持視覺一致性
