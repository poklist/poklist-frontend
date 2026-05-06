import { LocalStorageKey } from '@/enums/index.enum';
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@/lib/utils';
import { IdeaFormSchema } from '@/types/common';
import { IdeaBody } from '@/types/Idea';
import { create } from 'zustand';

interface TemporaryIdeaStore {
  idea: IdeaBody | null;
  setIdeaWithSync: (idea: IdeaBody) => void;
  // loadFromLocalStorage: () => void;
  // clearIdea: () => void;
  // clearIfMatchLocalStorage: () => void;
}

export const useTemporaryIdeaStore = create<TemporaryIdeaStore>((set, get) => ({
  idea: null,

  setIdeaWithSync: (idea) => {
    set({ idea });
    setLocalStorage(LocalStorageKey.IDEA_DRAFT, idea, IdeaFormSchema);
  },

  // /** 從 localStorage 載入資料（頁面重新整理後用） */
  // loadFromLocalStorage: () => {
  //   try {
  //     const stored = getLocalStorage(LocalStorageKey.IDEA_DRAFT, IdeaFormSchema);
  //     if (!stored) return;
  //     const parsed: IdeaBody = stored;
  //     set({ idea: parsed });
  //   } catch (err) {
  //     console.error('loadFromLocalStorage error:', err);
  //   }
  // },

  /** 清除暫存資料與 localStorage */
  // clearIdea: () => {
  //   set({ idea: null });
  //   removeLocalStorage(LocalStorageKey.IDEA_DRAFT);
  // },

  clearIfMatchLocalStorage: () => {
    const local = getLocalStorage(LocalStorageKey.IDEA_DRAFT, IdeaFormSchema);
    const storeIdea = get().idea;
    if (!local || !storeIdea) return;

    const localIdea: IdeaBody = local;

    const isMatch =
      localIdea.title === storeIdea.title &&
      localIdea.description === storeIdea.description &&
      localIdea.coverImage === storeIdea.coverImage &&
      localIdea.externalLink === storeIdea.externalLink;

    if (isMatch) {
      set({ idea: null });
      removeLocalStorage(LocalStorageKey.IDEA_DRAFT);
    }
  },
}));
