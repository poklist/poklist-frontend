'use client';

import { useCreateList } from '@/hooks/mutations/useCreateList';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigateAdapter from '@/hooks/useStrictNavigateAdapter';
import ListForm from '../_components/Form';
import Header from '../_components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { ListBody } from '@/types/List';
import { Trans } from '@lingui/react/macro';
import React, { useEffect } from 'react';

const CreatePage: React.FC = () => {
  const navigateTo = useStrictNavigateAdapter();
  const { setIsLoading } = useCommonStore();
  const { me } = useUserStore();
  const { checkAuthAndRedirect } = useAuthCheck();
  const { withAuth } = useAuthWrapper();

  const { createList, isCreateListLoading } = useCreateList({
    userCode: me.userCode,
  });

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigateTo.backward();
    }
  };

  useEffect(() => {
    if (isCreateListLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isCreateListLoading, setIsLoading]);

  const onCreateList = withAuth((listData: ListBody) => {
    createList(listData, {
      onSuccess: (data) => {
        if (!data) {
          throw new Error('Failed to create list');
        }
        navigateTo.manageList(me.userCode, data.id.toString());
      },
    });
  });

  useEffect(() => {
    checkAuthAndRedirect();
  }, [checkAuthAndRedirect]);

  return (
    <>
      <Header title={<Trans>Idea List</Trans>} />
      <div className="flex min-h-screen flex-col gap-6">
        <ListForm
          completedCallback={onCreateList}
          dismissCallback={onDismissCreate}
        />
      </div>
    </>
  );
};

export default CreatePage;
