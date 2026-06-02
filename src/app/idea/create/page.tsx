'use client';

import { PostIdeasRequest } from '@/api/query/ideas';
import IdeaForm from '@/app/idea/_components/Form';
import ListSelectorFakePage from '@/app/idea/_components/ListSelectorFakePage.tsx';
import { useFakePage } from '@/components/FakePage/useFakePage';
import { LocalStorageKey } from '@/enums/index.enum';
import { usePostNewIdea } from '@/hooks/api/ideas/usePostNewIdea';
import { useGetUserLists } from '@/hooks/api/lists/useGetUserLists';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { removeLocalStorage } from '@/lib/utils';
import useUserStore from '@/stores/useUserStore';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const IdeaCreatePage: React.FC = () => {
  const navigateTo = useStrictNavigationAdapter();
  const searchParams = useSearchParams();
  const listID = Number(searchParams?.get('listID'));
  const isNavigateFromList = listID > 0;
  const { me } = useUserStore();

  const { openFakePage } = useFakePage();

  const { withAuth } = useAuthWrapper();

  const { mutate: createIdea } = usePostNewIdea({
    onSuccess: () => {
      navigateTo.viewList(me?.userCode, listID.toString());
      removeLocalStorage(LocalStorageKey.IDEA_DRAFT);
    },
    // toast({
    //   title: error.message,
    //   variant: MessageType.ERROR,
    // });
  });

  const { data: lists } = useGetUserLists({
    userCode: me.userCode,
    limit: 99,
  });

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigateTo.backward();
    }
  };

  const onCreateIdea = withAuth(
    (ideaFormData: Omit<PostIdeasRequest, 'listID'>) => {
      if (isNavigateFromList) {
        createIdea({ body: { ...ideaFormData, listID } });
      } else {
        openFakePage('listSelector', { lists, ideaForm: ideaFormData });
      }
    }
  );

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
