import { getQueryClient } from '@/lib/queryClient';
import useEditProfileStore from '@/stores/useEditProfileStore';
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
      },
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;
