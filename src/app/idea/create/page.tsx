'use client';

import { PostIdeasRequest } from '@/api/query/ideas';
import IdeaForm from '@/app/idea/_components/Form';
import ListSelectorFakePage from '@/app/idea/_components/ListSelectorFakePage';
import { SignupDrawerVariant } from '@/components/Drawer/SignupDrawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { useFakePage } from '@/components/FakePage/useFakePage';
import { DrawerIds } from '@/constants/Drawer';
import { LocalStorageKey } from '@/enums/index.enum';
import { usePostNewIdea } from '@/hooks/api/ideas/usePostNewIdea';
import { useGetUserLists } from '@/hooks/api/lists/useGetUserLists';
import { useGetListsLimits } from '@/hooks/api/publish/useGetListsLimits';
import { useCheckCreateQuota } from '@/hooks/queries/publish/useCheckCreateQuota';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { removeLocalStorage } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const IdeaCreatePage: React.FC = () => {
  const navigateTo = useStrictNavigationAdapter();

  const searchParams = useSearchParams();
  const listID = searchParams?.get('listID');
  const isNavigateFromList = listID !== null;

  const { me } = useUserStore();

  const { isLoggedIn } = useAuthStore();

  const { data: listsLimits } = useGetListsLimits({ enabled: isLoggedIn });

  const { data: lists } = useGetUserLists({
    userCode: me.userCode,
    limit: listsLimits?.usedCount ?? 99,
  });

  const { openDrawer } = useDrawer(DrawerIds.SIGNUP_DRAWER_ID);

  const { openFakePage } = useFakePage();

  const { withAuth } = useAuthWrapper();

  const { checkCanCreate } = useCheckCreateQuota();

  const { mutate: createIdea } = usePostNewIdea({
    onSuccess: (data) => {
      navigateTo.viewList(me.userCode, data.listID);
      removeLocalStorage(LocalStorageKey.IDEA_DRAFT);
    },
  });

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigateTo.backward();
    }
  };

  const onCreateIdea = withAuth(
    (ideaFormData: Omit<PostIdeasRequest, 'listID'>) => {
      if (isNavigateFromList) {
        createIdea({ body: { ...ideaFormData, listID: listID.toString() } });
      } else {
        openFakePage('listSelector', { lists, ideaForm: ideaFormData });
      }
    }
  );

  useEffect(() => {
    if (!me.userCode) return;
    let active = true;
    void (async () => {
      const canCreate = await checkCanCreate(listID ?? undefined);
      if (active && !canCreate)
        openDrawer({
          isCloseable: false,
          variant: SignupDrawerVariant.IDEA_FULL,
        });
    })();
    return () => {
      active = false;
    };
  }, [me.userCode, listID]);

  return (
    <div className="mt-16 flex min-h-screen flex-col gap-6 sm:min-h-[calc(100vh-196px)]">
      <IdeaForm
        completedCallback={onCreateIdea}
        dismissCallback={onDismissCreate}
      />
      {!isNavigateFromList && <ListSelectorFakePage />}
    </div>
  );
};

export default IdeaCreatePage;
