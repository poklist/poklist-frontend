import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/types/User';

export type UserStoreState = {
  isLoggedIn: boolean;
  accessToken: string;
  me: User;

  login: (token: string) => void;
  refreshToken: (token: string) => void;
  logout: () => void;
  setMe: (user: User) => void;
};

export const emptyUser: User = {
  id: 0,
  displayName: '',
  userCode: '',
};

const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: '',
      me: { ...emptyUser },

      login: (token) => set({ isLoggedIn: true, accessToken: token }),
      refreshToken: (token) => set({ accessToken: token }),
      logout: () =>
        set({
          isLoggedIn: false,
          accessToken: '',
          me: { ...emptyUser },
        }),
      setMe: (user) => {
        set({ me: user });
      },
    }),
    { name: 'user-storage' }
  )
);

export default useUserStore;
