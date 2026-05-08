'use client';

import IdeaForm from '@/app/idea/_components/Form';
import ListSelectorFakePage from '@/app/idea/_components/ListSelectorFakePage.tsx';
import { useFakePage } from '@/components/FakePage/useFakePage';
import { LocalStorageKey } from '@/enums/index.enum';
import { MessageType } from '@/enums/Style/index.enum';
import { useGetUserLists } from '@/hooks/api/lists/useGetUserLists';
import { useCreateIdea } from '@/hooks/mutations/useCreateIdea';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import { removeLocalStorage } from '@/lib/utils';
import useUserStore from '@/stores/useUserStore';
import { IdeaBody } from '@/types/Idea';
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

  const { mutate: createIdea } = useCreateIdea();

  const { data: lists } = useGetUserLists({
    userCode: me.userCode,
    limit: 99
  });

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigateTo.backward();
    }
  };

  const onCreateIdea = withAuth((ideaFormData: IdeaBody) => {
    if (isNavigateFromList) {
      createIdea(
        { ...ideaFormData, listID },
        {
          onSuccess: () => {
            navigateTo.viewList(me?.userCode, listID.toString());
            removeLocalStorage(LocalStorageKey.IDEA_DRAFT);
          },
          onError: (error: Error) => {
            toast({
              title: error.message,
              variant: MessageType.ERROR,
            });
          },
        }
      );
    } else {
      openFakePage('listSelector', { lists, ideaForm: ideaFormData });
    }
  });

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
