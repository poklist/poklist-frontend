import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { GetUserInfoResponse } from '@/api/query/users';

export interface UserStoreState {
  me: GetUserInfoResponse['content'];
  setMe: (user: GetUserInfoResponse['content']) => void;
  resetMe: () => void;
}

export const emptyUser: GetUserInfoResponse['content'] = {
  id: 0,
  displayName: '',
  userCode: '',
  profileImage: '',
  listCount: 0,
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
