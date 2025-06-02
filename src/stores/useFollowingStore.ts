import { create } from 'zustand';

export type FollowingStoreState = {
  // 使用 Map 來追蹤每個 userCode 的關注狀態
  followingMap: Map<string, boolean>;
  // 獲取特定用戶的關注狀態
  getIsFollowing: (userCode: string) => boolean;
  // 檢查是否已經有該用戶的狀態
  hasFollowingState: (userCode: string) => boolean;
  // 設定特定用戶的關注狀態
  setIsFollowing: (userCode: string, isFollowing: boolean) => void;
  // 清除特定用戶的關注狀態
  clearFollowingStatus: (userCode: string) => void;
  // 清除所有關注狀態
  clearAllFollowingStatus: () => void;
};

// NOTE: 重構為支援多用戶關注狀態追蹤，可以針對不同 userCode 分別管理關注狀態
const useFollowingStore = create<FollowingStoreState>((set, get) => ({
  followingMap: new Map<string, boolean>(),

  getIsFollowing: (userCode: string) => {
    const { followingMap } = get();
    const isFollowing = followingMap.get(userCode) ?? false;
    return isFollowing;
  },

  hasFollowingState: (userCode: string) => {
    const { followingMap } = get();
    return followingMap.has(userCode);
  },

  setIsFollowing: (userCode: string, isFollowing: boolean) =>
    set((state) => {
      const newFollowingMap = new Map(state.followingMap);
      newFollowingMap.set(userCode, isFollowing);
      return { followingMap: newFollowingMap };
    }),

  clearFollowingStatus: (userCode: string) =>
    set((state) => {
      const newFollowingMap = new Map(state.followingMap);
      newFollowingMap.delete(userCode);
      return { followingMap: newFollowingMap };
    }),

  clearAllFollowingStatus: () =>
    set({ followingMap: new Map<string, boolean>() }),
}));

export default useFollowingStore;
