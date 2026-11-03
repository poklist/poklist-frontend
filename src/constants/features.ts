// Feature toggle：只用環境變數，在 build 時決定（NEXT_PUBLIC_* 會被 inline，改值要重新 build）。
// 新增開關：在 .env.example 加一個 NEXT_PUBLIC_FEATURE_* 變數，再登記到下方 FEATURES。
// 注意：必須寫成 process.env.NEXT_PUBLIC_XXX 的完整字面，Next 才會 inline；不要用動態 key 讀取。

// 只有字串 'true' 算開啟；未設定或其他值一律關閉
export const isFeatureOn = (value: string | undefined) => value === 'true';

export const FEATURES = {
  // 上鎖名單：開啟時走新的 /creator/lists API，關閉時走舊的 /lists API（階段 4 接上）。
  // 上鎖 UI 不受此開關影響，一律顯示。
  listLock: isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_LIST_LOCK),
} as const;
