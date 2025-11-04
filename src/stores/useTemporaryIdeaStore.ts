import { DESC_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/constants/form';
import { LocalStorageKey } from '@/enums/index.enum';
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@/lib/utils';
import { IdeaBody } from '@/types/Idea';
import z from 'zod';
import { create } from 'zustand';

interface TemporaryIdeaStore {
  idea: IdeaBody | null;
  setIdeaWithSync: (idea: IdeaBody) => void;
  // loadFromLocalStorage: () => void;
  // clearIdea: () => void;
  clearIfMatchLocalStorage: () => void;
}

const FormSchema = z.object({
  title: z.string().min(1).max(TITLE_MAX_LENGTH),
  description: z.string().max(DESC_MAX_LENGTH).optional(),
  externalLink: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().or(z.literal('')).nullable().optional(), // FUTURE: base64 check
});

export const useTemporaryIdeaStore = create<TemporaryIdeaStore>((set, get) => ({
  idea: null,

  setIdeaWithSync: (idea) => {
    set({ idea });
    setLocalStorage(LocalStorageKey.IDEA_DRAFT, idea, FormSchema);
  },

  // /** 從 localStorage 載入資料（頁面重新整理後用） */
  // loadFromLocalStorage: () => {
  //   try {
  //     const stored = getLocalStorage(LocalStorageKey.IDEA_DRAFT, FormSchema);
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
    try {
      const local = getLocalStorage(LocalStorageKey.IDEA_DRAFT, FormSchema);
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
    } catch (error) {
      console.error('clearIfMatchLocalStorage error:', error);
    }
  },
}));
