# 元件架構說明文件

## 元件架構的核心原則

本專案的元件系統遵循以下核心原則：

1. **關注點分離**：每個元件應有明確的單一職責
2. **適當的抽象層級**：根據元件的抽象程度和使用範圍進行分類
3. **合理的位置**：元件應該放在最接近其使用環境的位置

## 元件分類與位置

### 1. 全局元件 (`src/components/`)

全局元件資料夾只應包含**跨頁面複用**的元件。這些元件應當具有以下特點：

- 用於多個不同頁面
- 不包含特定頁面的業務邏輯
- 高度可重用

#### 不應放入 components 的元件

以下類型的元件**不應**放在全局 components 資料夾：

- 僅用於單一頁面的元件（應放在對應頁面的 Components 子目錄中）
- 包含特定頁面業務邏輯的元件
- 高度定制化、不具重用性的元件

正確位置示例：

- 僅在 HomePage 使用的 Hero 組件：`src/pages/Home/Components/Hero/`
- 僅在 Settings 頁面使用的設置項：`src/pages/Settings/Components/SettingItem/`

### 2. 基礎 UI 元件 (`src/components/ui/`)

這是最基本的界面構建塊，詳細說明請參見 [UI 元件文檔](./ui/README.md)。

### 3. 複合元件 (`src/components/[ComponentName]/`)

由多個基礎 UI 元件組合而成，可能包含簡單的狀態管理，但不處理複雜的業務邏輯。

**特點：**

- 可重用於多個頁面
- 可能包含簡單的內部狀態
- 可接收配置和回調函數

**範例：**

- `Dropdown` - 下拉選擇器
- `ImageUploader` - 圖片上傳元件
- `ImageCropper` - 圖片裁切元件

### 4. Provider 元件 (`src/components/[ProviderName]/`)

提供特定功能或狀態的 Context Provider 元件。這些元件在未來可能會遷移到 `src/providers/` 或 `src/contexts/` 目錄中。

**特點：**

- 提供整個應用或特定區域的共享狀態
- 通常包含 Context 和 Provider 組件
- 提供相應的 hook 以便消費者使用

**範例：**

- `Drawer` - 抽屜功能提供者
- `FakePage` - 假頁面功能提供者
- `Language` - 多語言功能提供者

## 命名規範

- 元件資料夾命名使用 PascalCase（首字母大寫），例如：`ImageUploader`
- 元件文件一般為 `index.tsx` 或使用元件名稱命名的 `.tsx` 文件
- 複合元件若有子元件，可放在同一資料夾內，使用適當的子資料夾或文件名

## 元件文件結構

每個元件資料夾應包含：

1. 主要元件文件（通常是 `index.tsx`）
2. README.md 文件說明元件用途和使用方法（複雜元件必須提供）
3. 子元件文件（如適用）
4. 元件特有的樣式文件（如適用）
5. 元件特有的工具函數（如適用）

## 元件開發指南

### 創建新元件

新元件應遵循以下原則：

1. **單一職責原則**：每個元件應該有明確的單一職責
2. **可組合性**：優先考慮元件的可組合性而非擴展性
3. **屬性類型定義**：所有元件props都應有明確的TypeScript類型定義
4. **合理默認值**：提供合理的默認值，減少使用時的配置負擔

### 元件重構指南

當現有元件需要重構時，考慮以下因素：

1. **過大的元件**：超過200行的元件應考慮拆分
2. **過於複雜的邏輯**：混合了多種職責的元件應進行分解
3. **重複的元件**：功能類似的元件應合併（如 Header 元件）
4. **位置錯誤的元件**：將僅用於特定頁面的元件移至對應頁面的 Components 目錄

## 使用示例

### 頁面專用元件 vs. 全局元件

✅ **正確的做法**：

```tsx
// 頁面專用元件放在頁面目錄下
// src/pages/Home/Components/HeroSection/index.tsx
export const HeroSection = () => {
  // 包含首頁特定邏輯的元件
  return (/* ... */);
};

// 全局通用元件放在全局 components 目錄
// src/components/Card/index.tsx
export const Card = ({ children }) => {
  // 可跨頁面複用的卡片元件
  return (/* ... */);
};
```

❌ **錯誤的做法**：

```tsx
// 不要將頁面專用元件放在全局 components 目錄
// src/components/HomeHero/index.tsx - 錯誤！
```

### Provider 元件

```tsx
import { LanguageProvider } from '@/components/Language';
import { DrawerProvider } from '@/components/Drawer';

function App() {
  return (
    <LanguageProvider>
      <DrawerProvider>{/* 應用內容 */}</DrawerProvider>
    </LanguageProvider>
  );
}
```

## 待改進項目

1. 將 Provider 元件移至專門的目錄（如 `src/providers/` 或 `src/contexts/`）
2. 統一 Header 元件：目前存在兩個類似的 Header 元件
3. 統一元件命名規範：確保所有元件資料夾使用 PascalCase
4. 引入 Storybook 等工具建立完整的元件庫文檔
5. 將各頁面專用元件從 components 移至對應頁面目錄
