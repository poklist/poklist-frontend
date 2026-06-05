import { create } from 'zustand';

export type LikeStoreState = {
  // 使用 Map 來追蹤每個 listID 的點讚狀態 Optimistic
  likeMap: Map<string, boolean>;
  // 上一次 API 已確認的狀態作為 rollback 基準
  confirmedLikeMap: Map<string, boolean>;
  // 獲取特定列表的點讚狀態
  getIsLiked: (listID: string) => boolean;
  // 檢查是否已經有該列表的狀態
  hasLikeState: (listID: string) => boolean;
  // 設定特定列表的點讚狀態
  setIsLiked: (listID: string, isLiked: boolean) => void;
  // 獲取上一次 API 確認的 like 狀態 default false
  getConfirmedIsLiked: (listID: string) => boolean;
  // 設定上一次 API 確認的 like 狀態 API onSuccess & initial
  setConfirmedIsLiked: (listID: string, isLiked: boolean) => void;
  // // 檢查是否已有 confirmed 狀態
  // hasConfirmedLikeState: (listID: string) => boolean;
  // 清除特定列表的點讚狀態
  clearLikeStatus: (listID: string) => void;
  // 清除所有點讚狀態
  clearAllLikeStatus: () => void;
};

// NOTE: 重構為支援多列表點讚狀態追蹤，可以針對不同 listID 分別管理點讚狀態
const useLikeStore = create<LikeStoreState>((set, get) => ({
  likeMap: new Map<string, boolean>(),
  confirmedLikeMap: new Map<string, boolean>(),

  getIsLiked: (listID: string) => {
    const { likeMap } = get();
    const isLiked = likeMap.get(listID) ?? false;
    return isLiked;
  },

  hasLikeState: (listID: string) => {
    const { likeMap } = get();
    return likeMap.has(listID);
  },

  setIsLiked: (listID: string, isLiked: boolean) =>
    set((state) => {
      const newLikeMap = new Map(state.likeMap);
      newLikeMap.set(listID, isLiked);
      return { likeMap: newLikeMap };
    }),

  getConfirmedIsLiked: (listID: string) => {
    const { confirmedLikeMap } = get();
    return confirmedLikeMap.get(listID) ?? false;
  },

  setConfirmedIsLiked: (listID: string, isLiked: boolean) =>
    set((state) => {
      const newMap = new Map(state.confirmedLikeMap);
      newMap.set(listID, isLiked);
      return { confirmedLikeMap: newMap };
    }),

  // hasConfirmedLikeState: (listID: string) => {
  //   const { confirmedLikeMap } = get();
  //   return confirmedLikeMap.has(listID);
  // },

  clearLikeStatus: (listID: string) =>
    set((state) => {
      const newLikeMap = new Map(state.likeMap);
      const newConfirmed = new Map(state.confirmedLikeMap);
      newLikeMap.delete(listID);
      newConfirmed.delete(listID);
      return { likeMap: newLikeMap, confirmedLikeMap: newConfirmed };
    }),

  clearAllLikeStatus: () =>
    set({
      likeMap: new Map<string, boolean>(),
      confirmedLikeMap: new Map<string, boolean>(),
    }),
}));

export default useLikeStore;
