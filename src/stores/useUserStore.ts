import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/types/User';

export interface UserStoreState {
  me: User;
  setMe: (user: User) => void;
  resetMe: () => void;
}

export const emptyUser: User = {
  id: 0,
  displayName: '',
  userCode: '',
};

const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      me: { ...emptyUser },
      setMe: (user) => {
        set({ me: user });
      },
      resetMe: () => {
        set({ me: emptyUser });
      },
    }),
    { name: 'user-storage' }
  )
);

export default useUserStore;
