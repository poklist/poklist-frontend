import { getQueryClient } from '@/lib/queryClient';
import useEditProfileStore from '@/stores/useEditProfileStore';
import useFollowingStore from '@/stores/useFollowingStore';
import useLikeStore from '@/stores/useLikeStore';
import useUserStore from '@/stores/useUserStore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserStoreState = {
  isLoggedIn: boolean;
  accessToken: string;

  login: (token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
};

const useAuthStore = create<UserStoreState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: '',

      login: (token) => {
        set({ isLoggedIn: true, accessToken: token });
      },
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => {
        set({
          isLoggedIn: false,
          accessToken: '',
        });
        useUserStore.getState().resetMe();
        useEditProfileStore.getState().resetNewUserInfo();
        getQueryClient().clear();
        useFollowingStore.getState().resetFollowingStore();
        useLikeStore.getState().clearAllLikeStatus();
      },
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;
