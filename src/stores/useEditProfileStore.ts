import { SocialLinkType } from '@/enums/index.enum';
import { User } from '@/types/User';
import { create } from 'zustand';
import useUserStore from './useUserStore';

export type EditProfileStoreState = {
  newUserInfo: User;
  setNewUserInfo: (user: User) => void;
  resetNewUserInfo: () => void;
  setDisplayName: (value: string) => void;
  /* file is base64 string */
  setProfileImage: (file: string) => void; // NOTE: empty string represents no image
  setUserCode: (value: string) => void;
  setBio: (value: string) => void;
  setSocialLink: (type: SocialLinkType, value: string) => void;
  isModified: () => boolean;
};

const useEditProfileStore = create<EditProfileStoreState>((set, get) => ({
  newUserInfo: {
    ...useUserStore.getState().user,
  },
  setNewUserInfo: (user: User) => set({ newUserInfo: user }),
  resetNewUserInfo: () =>
    set({ newUserInfo: { ...useUserStore.getState().user } }),
  setDisplayName: (value: string) =>
    set({ newUserInfo: { ...get().newUserInfo, displayName: value } }),
  setProfileImage: (file: string) =>
    set({ newUserInfo: { ...get().newUserInfo, profileImage: file } }),
  setUserCode: (value: string) =>
    set({ newUserInfo: { ...get().newUserInfo, userCode: value } }),
  setBio: (value: string) =>
    set({ newUserInfo: { ...get().newUserInfo, bio: value } }),
  setSocialLink: (type: SocialLinkType, value: string) =>
    set({
      newUserInfo: {
        ...get().newUserInfo,
        socialLinks: { ...get().newUserInfo.socialLinks, [type]: value },
      },
    }),

  isModified: () => {
    const originalUserInfo = useUserStore.getState().user;
    if (
      get().newUserInfo.displayName !== '' &&
      get().newUserInfo.displayName !== originalUserInfo.displayName
    ) {
      return true;
    }
    if (get().newUserInfo.userCode !== originalUserInfo.userCode) {
      return true;
    }
    if (get().newUserInfo.bio !== originalUserInfo.bio) {
      return true;
    }
    if (get().newUserInfo.socialLinks !== originalUserInfo.socialLinks) {
      return true;
    }
    // NOTE: optional field in request body
    // empty string represents that there is no image
    // undefined represents that there is no change
    if (
      get().newUserInfo.profileImage !== undefined &&
      get().newUserInfo.profileImage !== originalUserInfo.profileImage
    ) {
      return true;
    }

    return false;
  },
}));

export default useEditProfileStore;
