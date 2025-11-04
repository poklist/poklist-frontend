'use client';

import ListForm from '@/app/list/_components/Form';
import { LocalStorageKey } from '@/enums/index.enum';
import { useCreateList } from '@/hooks/mutations/useCreateList';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { removeLocalStorage } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { ListBody } from '@/types/List';
import React, { useEffect } from 'react';

const CreatePage: React.FC = () => {
  const navigateTo = useStrictNavigateNext();
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
  }, [isCreateListLoading]);

  const onCreateList = withAuth((listData: ListBody) => {
    createList(listData, {
      onSuccess: (data) => {
        if (!data) {
          throw new Error('Failed to create list');
        }
        navigateTo.viewList(me.userCode, data.id.toString());
        removeLocalStorage(LocalStorageKey.LIST_DRAFT);
      },
    });
  });

  useEffect(() => {
    checkAuthAndRedirect();
  }, [checkAuthAndRedirect]);

  return (
    <div className="flex min-h-screen flex-col gap-4">
      <ListForm
        completedCallback={onCreateList}
        dismissCallback={onDismissCreate}
      />
    </div>
  );
};

export default CreatePage;
