'use client';

import { PostListsRequest } from '@/api/query/lists';
import ListForm from '@/app/list/_components/Form';
import { LocalStorageKey } from '@/enums/index.enum';
import { usePostNewList } from '@/hooks/api/lists/usePostNewList';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { removeLocalStorage } from '@/lib/utils';
import useUserStore from '@/stores/useUserStore';
import React, { useEffect } from 'react';

const CreatePage: React.FC = () => {
  const navigateTo = useStrictNavigateNext();
  const { me } = useUserStore();
  const { checkAuthAndRedirect } = useAuthCheck();
  const { withAuth } = useAuthWrapper();

  const { mutate: createList } = usePostNewList({
    userCode: me.userCode,
    onSuccess: (data) => {
      if (!data) {
        throw new Error('Failed to create list');
      }
      navigateTo.viewList(me.userCode, data.id.toString());
      removeLocalStorage(LocalStorageKey.LIST_DRAFT);
    },
  });

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigateTo.backward();
    }
  };

  const onCreateList = withAuth((listData: PostListsRequest) => {
    createList({ body: listData });
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
