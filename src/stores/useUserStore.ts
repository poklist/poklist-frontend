import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/types/User';

export type UserStoreState = {
  isLoggedIn: boolean;
  accessToken: string;
  user: User;
  currentUser: User;

  login: (token: string) => void;
  refreshToken: (token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setCurrentUser: (user: User) => void;
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
      user: { ...emptyUser },
      currentUser: { ...emptyUser },

      login: (token) => set({ isLoggedIn: true, accessToken: token }),
      refreshToken: (token) => set({ accessToken: token }),
      logout: () =>
        set({
          isLoggedIn: false,
          accessToken: '',
          user: { ...emptyUser },
        }),
      setUser: (user) => {
        set({ user });
      },
      setCurrentUser: (user) => {
        set({ currentUser: user });
      },
    }),
    { name: 'user-storage' }
  )
);

export default useUserStore;
