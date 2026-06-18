import { create } from 'zustand';

export type FollowingStoreState = {
  // 使用 Map 來追蹤每個 userCode 的關注狀態 Optimistic
  followingMap: Map<string, boolean>;
  followerCountMap: Map<string, number>;
  // 上一次 API 已確認的狀態作為 rollback 基準
  confirmedFollowingMap: Map<string, boolean>;

  // setFollowerCount: (userCode: string, count: number) => void;
  // getFollowerCount: (userCode: string) => number;

  // 設定特定用戶的關注狀態
  setIsFollowing: (userCode: string, isFollowing: boolean) => void;
  // 獲取特定用戶的關注狀態
  getIsFollowing: (userCode: string) => boolean;

  // 檢查是否已經有該用戶的狀態
  hasFollowingState: (userCode: string) => boolean;

  // 獲取上一次 API 確認的 follow 狀態 default false
  getConfirmedIsFollowing: (userCode: string) => boolean;
  // 設定上一次 API 確認的 follow 狀態 API onSuccess & initial
  setConfirmedIsFollowing: (userCode: string, isFollowing: boolean) => void;
  // 檢查是否已有 confirmed 狀態
  hasConfirmedFollowingState: (userCode: string) => boolean;

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
  confirmedFollowingMap: new Map<string, boolean>(),

  // setFollowerCount: (userCode: string, count: number): void => {
  //   set((state) => {
  //     const newFollowerCountMap = new Map(state.followerCountMap);
  //     newFollowerCountMap.set(userCode, count);
  //     return { followerCountMap: newFollowerCountMap };
  //   });
  // },
  // getFollowerCount: (userCode: string): number => {
  //   const { followerCountMap } = get();
  //   return followerCountMap.get(userCode) ?? 0;
  // },

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

  getConfirmedIsFollowing: (userCode: string) => {
    const { confirmedFollowingMap } = get();
    return confirmedFollowingMap.get(userCode) ?? false;
  },

  setConfirmedIsFollowing: (userCode: string, isFollowing: boolean) =>
    set((state) => {
      const newMap = new Map(state.confirmedFollowingMap);
      newMap.set(userCode, isFollowing);
      return { confirmedFollowingMap: newMap };
    }),

  hasConfirmedFollowingState: (userCode: string) => {
    const { confirmedFollowingMap } = get();
    return confirmedFollowingMap.has(userCode);
  },

  // Clear
  clearFollowingStatus: (userCode: string) =>
    set((state) => {
      const newFollowingMap = new Map(state.followingMap);
      const newFollowerCountMap = new Map(state.followerCountMap);
      const newConfirmed = new Map(state.confirmedFollowingMap);
      newFollowingMap.delete(userCode);
      newFollowerCountMap.delete(userCode);
      newConfirmed.delete(userCode);
      return {
        followingMap: newFollowingMap,
        followerCountMap: newFollowerCountMap,
        confirmedFollowingMap: newConfirmed,
      };
    }),
  resetFollowingStore: () =>
    set({
      followingMap: new Map<string, boolean>(),
      followerCountMap: new Map<string, number>(),
      confirmedFollowingMap: new Map<string, boolean>(),
    }),
}));

export default useFollowingStore;
