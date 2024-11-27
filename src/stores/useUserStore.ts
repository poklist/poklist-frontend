import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/models/User';

export type UserStoreState = {
  isLoggedIn: boolean;
  accessToken: string;
  user: User;

  login: (token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
};

const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: '',
      user: {
        id: 0,
        displayName: '',
        userCode: '',
      },

      login: (token) => set({ isLoggedIn: true, accessToken: token }),
      logout: () => set({ isLoggedIn: false }),
      setUser: (user) => set({ user }),
    }),
    { name: 'user-storage' }
  )
);

export default useUserStore;
