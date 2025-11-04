'use client';

import { migrateUserRoute } from '@/lib/routeMigration';
import { useTemporaryIdeaStore } from '@/stores/useTemporaryIdeaStore';
import { IdeaBody } from '@/types/Idea';
import { useRouter } from 'next/navigation';

interface CreateIdeaOptions {
  listID?: number;
  listTitle?: string;
}

const useStrictNavigationNext = () => {
  const router = useRouter();
  const temporaryIdeaStore = useTemporaryIdeaStore();

  return {
    refresh: () => router.refresh(),
    backward: () => router.back(),
    home: () => router.push('/'),
    discovery: () => router.push('/discovery'),
    official: () => router.push('/official'),
    settings: () => router.push('/settings'),
    error: () => router.push('/error'),
    goToMobile: () => router.push('/goToMobile'),

    // 用戶相關路由，移除@前綴
    user: (userCode: string) => {
      const cleanUserCode = migrateUserRoute(userCode);
      router.push(`/${cleanUserCode}`);
    },
    editUser: () => router.push('/user/edit'),
    createList: () => router.push('/list/create'),
    viewList: (userCode: string, listID: string, ideaID?: string) => {
      const cleanUserCode = migrateUserRoute(userCode);
      const path = `/${cleanUserCode}/list/${listID}`;
      if (ideaID) {
        // 使用searchParams而不是state
        router.push(`${path}?ideaID=${ideaID}`);
      } else {
        router.push(path);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    manageList: (userCode: string, listID: string) => {
      const cleanUserCode = migrateUserRoute(userCode);
      router.push(`/${cleanUserCode}/list/${listID}/manage`);
    },
    editList: (userCode: string, listID: string) => {
      const cleanUserCode = migrateUserRoute(userCode);
      router.push(`/${cleanUserCode}/list/${listID}/edit`);
    },
    temporaryCreateList: (ideaForm: IdeaBody) => {
      temporaryIdeaStore.setIdeaWithSync(ideaForm);
      router.push(`/idea/list`);
    },
    createIdea: (options?: CreateIdeaOptions | string) => {
      if (typeof options === 'string') {
        router.push(options);
      } else if (options && typeof options === 'object') {
        // 處理對象參數，使用查詢參數傳遞數據
        const { listID, listTitle } = options;
        const searchParams = new URLSearchParams();

        if (listID) searchParams.set('listID', listID.toString());
        if (listTitle) searchParams.set('listTitle', listTitle);

        const queryString = searchParams.toString();
        router.push(`/idea/create${queryString ? '?' + queryString : ''}`);
      } else {
        router.push('/idea/create');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    editIdea: (ideaID: string) => {
      router.push(`/idea/${ideaID}/edit`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  };
};

export default useStrictNavigationNext;
