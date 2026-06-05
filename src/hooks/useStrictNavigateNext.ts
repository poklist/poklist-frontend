'use client';

import { useAuthWrapper } from '@/hooks/useAuth';
import { migrateUserRoute } from '@/lib/routeMigration';
import useCommonStore from '@/stores/useCommonStore';
import { useTemporaryIdeaStore } from '@/stores/useTemporaryIdeaStore';
import { IdeaBody } from '@/types/Idea';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';

interface CreateIdeaOptions {
  listID?: number;
  listTitle?: string;
}

const useStrictNavigationNext = () => {
  const router = useRouter();
  const temporaryIdeaStore = useTemporaryIdeaStore();
  const { setIsLoading } = useCommonStore();
  const { withAuth } = useAuthWrapper();

  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending]);

  const atNavigate = (navigationAction: () => void) => {
    startTransition(() => {
      navigationAction();
    });
  };

  return {
    refresh: () => {
      setIsLoading(true);
      startTransition(() => router.refresh());
    },
    backward: () => atNavigate(() => router.back()),
    home: () => atNavigate(() => router.push('/')),
    discovery: () => atNavigate(() => router.push('/discovery')),
    official: () => atNavigate(() => router.push('/official')),
    settings: () => atNavigate(() => router.push('/settings')),
    error: () => atNavigate(() => router.push('/error')),
    goToMobile: () => atNavigate(() => router.push('/goToMobile')),

    // 用戶相關路由，移除@前綴
    user: (userCode: string) => {
      atNavigate(() => {
        const cleanUserCode = migrateUserRoute(userCode);
        router.push(`/${cleanUserCode}`);
      });
    },
    editUser: withAuth(() => atNavigate(() => router.push('/user/edit'))),
    createList: withAuth(() => atNavigate(() => router.push('/list/create'))),
    viewList: (userCode: string, listID: string, ideaID?: string) => {
      atNavigate(() => {
        const cleanUserCode = migrateUserRoute(userCode);
        const path = `/${cleanUserCode}/list/${listID}`;
        if (ideaID) {
          // 使用searchParams而不是state
          router.push(`${path}?ideaID=${ideaID}`);
        } else {
          router.push(path);
        }
      });
    },
    reorderList: withAuth((userCode: string, listID: string) =>
      atNavigate(() => {
        const cleanUserCode = migrateUserRoute(userCode);
        router.push(`/${cleanUserCode}/list/${listID}/reorder`);
      })
    ),
    editList: withAuth((userCode: string, listID: string) =>
      atNavigate(() => {
        const cleanUserCode = migrateUserRoute(userCode);
        router.push(`/${cleanUserCode}/list/${listID}/edit`);
      })
    ),
    temporaryCreateList: withAuth((ideaForm: IdeaBody) =>
      atNavigate(() => {
        temporaryIdeaStore.setIdeaWithSync(ideaForm);
        router.push(`/idea/create/list`);
      })
    ),
    createIdea: withAuth((options?: CreateIdeaOptions | string) =>
      atNavigate(() => {
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
      })
    ),
    editIdea: withAuth((ideaID: string) =>
      atNavigate(() => {
        router.push(`/idea/${ideaID}/edit`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
    ),
  };
};

export default useStrictNavigationNext;
