# Drawer Component

Drawer 元件是一個提供下方抽屜功能的 Provider 組件系統。它允許在全應用範圍內管理多個抽屜的開關狀態。

## 元件概述

Drawer 元件包含以下部分：

1. `DrawerProvider` - 提供抽屜狀態管理的 Context Provider
2. `DrawerComponent` - 具體的抽屜 UI 元件
3. `useDrawer` - 用於控制抽屜的自定義 Hook

## 使用方法

### 設置 Provider

首先，在應用的高層次組件中設置 DrawerProvider：

```tsx
import { DrawerProvider } from '@/components/Drawer';

function App() {
  return <DrawerProvider>{/* 應用內容 */}</DrawerProvider>;
}
```

### 定義抽屜 ID

為了識別不同的抽屜，建議在 constants 文件中定義抽屜 ID：

```tsx
// src/constants/Drawer.ts
export enum DrawerIds {
  SETTINGS_DRAWER_ID = 'settings-drawer',
  FILTER_DRAWER_ID = 'filter-drawer',
  // 其他抽屜 ID...
}
```

### 創建抽屜組件

使用 DrawerComponent 元件創建抽屜：

```tsx
import { DrawerComponent } from '@/components/Drawer';
import { DrawerIds } from '@/constants/Drawer';

function MyComponent() {
  return (
    <div>
      {/* 其他內容 */}
      <DrawerComponent
        drawerId={DrawerIds.SETTINGS_DRAWER_ID}
        content={<div>抽屜內容</div>}
        isShowClose={true}
      />
    </div>
  );
}
```

### 控制抽屜狀態

使用 useDrawer hook 控制抽屜的開關：

```tsx
import { useDrawer } from '@/components/Drawer';
import { DrawerIds } from '@/constants/Drawer';

function MyComponent() {
  const { openDrawer, closeDrawer, isDrawerOpen } = useDrawer();

  return (
    <div>
      <button onClick={() => openDrawer(DrawerIds.SETTINGS_DRAWER_ID)}>
        開啟設置
      </button>

      {isDrawerOpen(DrawerIds.SETTINGS_DRAWER_ID) && <div>抽屜已開啟</div>}
    </div>
  );
}
```

### 特定抽屜的簡化使用

為特定抽屜提供更簡潔的使用方式：

```tsx
import { useDrawer } from '@/components/Drawer';
import { DrawerIds } from '@/constants/Drawer';

function MyComponent() {
  // 提供特定抽屜的控制函數
  const { isOpen, openDrawer, closeDrawer } = useDrawer(
    DrawerIds.SETTINGS_DRAWER_ID
  );

  return (
    <div>
      <button onClick={openDrawer}>開啟設置</button>
      {isOpen && <div>設置抽屜已開啟</div>}
    </div>
  );
}
```

## 特性

- 支持多個獨立管理的抽屜
- 統一的抽屜狀態管理
- 可自定義抽屜內容和行為
- 便捷的 Hook API

## 實現原理

- 使用 React Context API 管理全局抽屜狀態
- 使用 Set 數據結構存儲當前開啟的抽屜 ID
- 提供 hook 以統一方式訪問和控制抽屜

## 注意事項

- 由於抽屜狀態在 DrawerProvider 中管理，確保所有抽屜操作都在 Provider 範圍內
- 抽屜 ID 應該是唯一的，建議使用常量管理
- 當需要在應用程序的不同部分調用相同抽屜時，使用 drawerId 參數
