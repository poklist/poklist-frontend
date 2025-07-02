'use client';

import { useRouter } from 'next/navigation';
import { migrateUserRoute } from '@/lib/routeMigration';

interface CreateIdeaOptions {
  listID?: number;
  listTitle?: string;
}

const useStrictNavigationNext = () => {
  const router = useRouter();

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
    },
    manageList: (userCode: string, listID: string) => {
      const cleanUserCode = migrateUserRoute(userCode);
      router.push(`/${cleanUserCode}/list/${listID}/manage`);
    },
    editList: (userCode: string, listID: string) => {
      const cleanUserCode = migrateUserRoute(userCode);
      router.push(`/${cleanUserCode}/list/${listID}/edit`);
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
    },
    editIdea: (ideaID: string) => router.push(`/idea/${ideaID}/edit`),
  };
};

export default useStrictNavigationNext;
