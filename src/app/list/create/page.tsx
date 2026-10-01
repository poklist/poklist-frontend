'use client';

import { PostListsRequest } from '@/api/query/lists';
import ListForm, { ListFormHandle } from '@/app/list/_components/Form';
import EditModeHeader from '@/components/Header/EditModeHeader';
import { LocalStorageKey } from '@/enums/index.enum';
import { usePostNewList } from '@/hooks/api/lists/usePostNewList';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { removeLocalStorage } from '@/lib/utils';
import useUserStore from '@/stores/useUserStore';
import { t } from '@lingui/macro';
import React, { useEffect, useRef } from 'react';

const CreatePage: React.FC = () => {
  const navigateTo = useStrictNavigateNext();
  const { me } = useUserStore();
  const { checkAuthAndRedirect } = useAuthCheck();
  const { withAuth } = useAuthWrapper();

  const formRef = useRef<ListFormHandle>(null);

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
      <EditModeHeader
        title={t`建立靈感名單`}
        onClose={() => formRef.current?.requestClose()}
      />
      <ListForm
        ref={formRef}
        isEdit={false}
        completedCallback={onCreateList}
        dismissCallback={onDismissCreate}
      />
    </div>
  );
};

export default CreatePage;
