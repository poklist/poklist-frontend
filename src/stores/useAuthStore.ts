import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useEditProfileStore from './useEditProfileStore';
import useUserStore from './useUserStore';

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
      },
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;
