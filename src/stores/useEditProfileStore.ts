import { User } from '@/types/User';
import { create } from 'zustand';
import useUserStore from './useUserStore';

export type EditProfileStoreState = {
  newUserInfo: User;
  setNewUserInfo: (user: User) => void;

  isModified: () => boolean;
};

const useEditProfileStore = create<EditProfileStoreState>((set, get) => ({
  newUserInfo: { ...useUserStore.getState().user },
  setNewUserInfo: (user: User) => set({ newUserInfo: user }),

  isModified: () => {
    const originalUserInfo = useUserStore.getState().user;
    if (get().newUserInfo.displayName !== originalUserInfo.displayName) {
      return true;
    }
    if (get().newUserInfo.userCode !== originalUserInfo.userCode) {
      return true;
    }
    if (get().newUserInfo.bio !== originalUserInfo.bio) {
      return true;
    }

    return false;
  },
}));

export default useEditProfileStore;
