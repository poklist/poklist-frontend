import { create } from 'zustand';

export type FollowingStoreState = {
  // 使用 Map 來追蹤每個 userCode 的關注狀態
  followingMap: Map<string, boolean>;
  followerCountMap: Map<string, number>;

  setFollowerCount: (userCode: string, count: number) => void;
  getFollowerCount: (userCode: string) => number;

  // 設定特定用戶的關注狀態
  setIsFollowing: (userCode: string, isFollowing: boolean) => void;
  // 獲取特定用戶的關注狀態
  getIsFollowing: (userCode: string) => boolean;

  // 檢查是否已經有該用戶的狀態
  hasFollowingState: (userCode: string) => boolean;

  // 清除特定用戶的關注狀態
  clearFollowingStatus: (userCode: string) => void;
  // 清除所有關注狀態
  resetFollowingStore: () => void;
};

// NOTE: 重構為支援多用戶關注狀態追蹤，可以針對不同 userCode 分別管理關注狀態
const useFollowingStore = create<FollowingStoreState>((set, get) => ({
  // State
  followingMap: new Map<string, boolean>(),
  followerCountMap: new Map<string, number>(),

  setFollowerCount: (userCode: string, count: number): void => {
    set((state) => {
      const newFollowerCountMap = new Map(state.followerCountMap);
      newFollowerCountMap.set(userCode, count);
      return { followerCountMap: newFollowerCountMap };
    });
  },
  getFollowerCount: (userCode: string): number => {
    const { followerCountMap } = get();
    return followerCountMap.get(userCode) ?? 0;
  },

  setIsFollowing: (userCode: string, isFollowing: boolean) =>
    set((state) => {
      const newFollowingMap = new Map(state.followingMap);
      newFollowingMap.set(userCode, isFollowing);
      return { followingMap: newFollowingMap };
    }),
  getIsFollowing: (userCode: string) => {
    const { followingMap } = get();
    return followingMap.get(userCode) ?? false;
  },

  hasFollowingState: (userCode: string) => {
    const { followingMap } = get();
    return followingMap.has(userCode);
  },

  // Clear
  clearFollowingStatus: (userCode: string) =>
    set((state) => {
      const newFollowingMap = new Map(state.followingMap);
      const newFollowerCountMap = new Map(state.followerCountMap);
      newFollowingMap.delete(userCode);
      newFollowerCountMap.delete(userCode);
      return {
        followingMap: newFollowingMap,
        followerCountMap: newFollowerCountMap,
      };
    }),
  resetFollowingStore: () =>
    set({
      followingMap: new Map<string, boolean>(),
      followerCountMap: new Map<string, number>(),
    }),
}));

export default useFollowingStore;
