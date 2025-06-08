# Language Component

本元件提供多語言功能，支持語言切換和國際化功能。基於 [LinguiJS](https://lingui.js.org/) 構建。

## 元件概述

Language 元件包含以下主要部分：

1. `LanguageProvider` - 提供語言環境的 Context Provider
2. `LanguageSelector` - 下拉式語言選擇器
3. `LanguageToggleButton` - 語言切換按鈕（簡化版）
4. `activateI18n` - 激活指定語言的工具函數 (放在 useLanguage.ts 中以便 React 做 Fast Refresh)

## 使用方法

### LanguageProvider

用於包裹應用或頁面，提供語言環境：

```tsx
import { LanguageProvider } from '@/components/Language';

function App() {
  return <LanguageProvider>{/* 應用內容 */}</LanguageProvider>;
}
```

### LanguageSelector

提供下拉式語言選擇器：

```tsx
import { LanguageSelector } from '@/components/Language';

function Header() {
  return (
    <header>
      {/* 其他內容 */}
      <LanguageSelector />
    </header>
  );
}
```

### LanguageToggleButton

提供簡單的語言切換按鈕：

```tsx
import { LanguageToggleButton } from '@/components/Language';

function Header() {
  return (
    <header>
      {/* 其他內容 */}
      <LanguageToggleButton />
    </header>
  );
}
```

### activateI18n

直接激活指定語言：

```tsx
import { activateI18n } from '@/components/Language/useLanguage';
import { Language } from '@/enums/index.enum';

// 手動切換到繁體中文
activateI18n(Language.ZH_TW);
```

## 支持的語言

目前支持的語言有：

- 英文 (EN)
- 繁體中文 (ZH_TW)

要新增語言，請執行以下步驟：

1. 在 `src/enums/index.enum.ts` 中新增語言枚舉值
2. 在 `src/locales/` 建立對應的語言文件夾和 messages.ts 檔案
3. 在 Language 元件中更新 `i18nOptions` 數組

## 工作原理

1. 元件初始化時會從 localStorage 讀取用戶先前選擇的語言
2. 如果沒有找到已保存的語言設置，則默認使用英文 (EN)
3. 當用戶切換語言時，新的語言設置會存儲在 localStorage 中
4. 語言切換時會重新渲染所有使用了翻譯的元件

## 內部實現

本元件依賴：

- [@lingui/core](https://lingui.js.org/ref/core.html) - 核心i18n功能
- [@lingui/react](https://lingui.js.org/ref/react.html) - React集成
- 本地存儲工具 - 記住用戶的語言偏好

## 注意事項

- `WatchLocale` 是一個內部元件，不建議直接使用
- 語言文件採用懶加載方式，僅在需要時才載入
- 通過 Context API 確保整個應用使用相同的語言環境
