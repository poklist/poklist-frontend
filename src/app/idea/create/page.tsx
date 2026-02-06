'use client';

import IdeaForm from '@/app/idea/_components/Form';
import ListSelectorFakePage from '@/app/idea/_components/ListSelectorFakePage.tsx';
import { useFakePage } from '@/components/FakePage/useFakePage';
import { LocalStorageKey } from '@/enums/index.enum';
import { MessageType } from '@/enums/Style/index.enum';
import { useCreateIdea } from '@/hooks/mutations/useCreateIdea';
import { useListPreviews } from '@/hooks/queries/useLists';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import { removeLocalStorage } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaBody } from '@/types/Idea';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const IdeaCreatePage: React.FC = () => {
  const navigateTo = useStrictNavigationAdapter();
  const searchParams = useSearchParams();
  const listID = Number(searchParams?.get('listID'));
  const isNavigateFromList = listID > 0;
  const { setIsLoading } = useCommonStore();
  const { me } = useUserStore();

  const { openFakePage } = useFakePage();

  const { withAuth } = useAuthWrapper();

  const { mutate: createIdea, isPending: createIdeaLoading } = useCreateIdea();

  const { data: lists, isLoading: isGettingLists } = useListPreviews({
    userCode: me.userCode,
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
            removeLocalStorage(LocalStorageKey.IDEA_DRAFT);
            navigateTo.viewList(me?.userCode, listID.toString());
          },
          onError: (error: Error) => {
            toast({
              title: error.message,
              variant: MessageType.ERROR,
            });
            setIsLoading(false);
          },
        }
      );
    } else {
      openFakePage('listSelector', { lists, ideaForm: ideaFormData });
    }
  });

  useEffect(() => {
    if (createIdeaLoading || isGettingLists) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [createIdeaLoading, isGettingLists]);

  return (
    <div className="mt-16 flex min-h-screen flex-col gap-6 sm:min-h-[calc(100vh-196px)]">
      <IdeaForm
        completedCallback={onCreateIdea}
        dismissCallback={onDismissCreate}
      />
      <ListSelectorFakePage />
    </div>
  );
};

export default IdeaCreatePage;
