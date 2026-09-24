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
