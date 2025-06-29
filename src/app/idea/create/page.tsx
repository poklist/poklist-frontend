'use client';

import { useCreateIdea } from '@/hooks/mutations/useCreateIdea';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import IdeaForm from '../_components/Form';
import Header from '../_components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaBody } from '@/types/Idea';
import { Trans } from '@lingui/react/macro';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export interface CreateIdeaNavigateState {
  listID: number;
  listTitle: string;
}

const IdeaCreatePage: React.FC = () => {
  const navigateTo = useStrictNavigationAdapter();
  const searchParams = useSearchParams();
  const listID = Number(searchParams?.get('listID'));
  const listTitle = searchParams?.get('listTitle') || '';
  const { setIsLoading, setShowingAlert } = useCommonStore();
  const { me } = useUserStore();

  const { withAuth } = useAuthWrapper();

  const { mutate: createIdea, isPending: createIdeaLoading } = useCreateIdea();

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigateTo.backward();
    }
  };

  const onCreateIdea = withAuth((ideaFormData: IdeaBody) => {
    createIdea(
      { ...ideaFormData, listID },
      {
        onSuccess: () => {
          navigateTo.manageList(me?.userCode, listID.toString());
        },
        onError: (error: Error) => {
          setShowingAlert(true, { message: String(error) });
          setIsLoading(false);
        },
      }
    );
  });

  useEffect(() => {
    if (createIdeaLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [createIdeaLoading, setIsLoading]);

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-col">
        <Header title={listTitle} />
        <div className="border-b border-black-text-01 bg-yellow-bright-01 px-4 py-3 text-t1 font-semibold">
          <Trans>New Idea</Trans>
        </div>
      </div>
      <div className="flex min-h-screen flex-col gap-6 sm:min-h-[calc(100vh-196px)]">
        <IdeaForm
          completedCallback={onCreateIdea}
          dismissCallback={onDismissCreate}
        />
      </div>
    </>
  );
};

export default IdeaCreatePage;
