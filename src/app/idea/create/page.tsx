'use client';

import IdeaForm from '@/app/idea/_components/Form';
import { LocalStorageKey } from '@/enums/index.enum';
import { MessageType } from '@/enums/Style/index.enum';
import { useCreateIdea } from '@/hooks/mutations/useCreateIdea';
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

  const { withAuth } = useAuthWrapper();

  const { mutate: createIdea, isPending: createIdeaLoading } = useCreateIdea();

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
              title: String(error),
              variant: MessageType.ERROR,
            });
            setIsLoading(false);
          },
        }
      );
    } else {
      toast({
        title: 'No list selected',
        variant: MessageType.ERROR,
      });
    }
  });

  useEffect(() => {
    if (createIdeaLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [createIdeaLoading, setIsLoading]);

  return (
    <div className="mt-16 flex min-h-screen flex-col gap-6 sm:min-h-[calc(100vh-196px)]">
      <IdeaForm
        isNavigateFromList={isNavigateFromList}
        completedCallback={onCreateIdea}
        dismissCallback={onDismissCreate}
      />
    </div>
  );
};

export default IdeaCreatePage;
