'use client';

import ListForm, { ListFormHandle } from '@/app/list/_components/Form';
import EditModeHeader from '@/components/Header/EditModeHeader';
import { LocalStorageKey } from '@/enums/index.enum';
import { FEATURES } from '@/constants/features';
import { toCreatorListPostRequest } from '@/hooks/api/lists/toCreatorListPostRequest';
import { usePostCreatorList } from '@/hooks/api/lists/usePostCreatorList';
import { usePostNewList } from '@/hooks/api/lists/usePostNewList';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { removeLocalStorage } from '@/lib/utils';
import useUserStore from '@/stores/useUserStore';
import { ListBaseSchema, ListFormSchema } from '@/types/common';
import { t } from '@lingui/macro';
import React, { useEffect, useRef } from 'react';
import z from 'zod';

const CreatePage: React.FC = () => {
  const navigateTo = useStrictNavigateNext();
  const { me } = useUserStore();
  const { checkAuthAndRedirect } = useAuthCheck();
  const { withAuth } = useAuthWrapper();

  const formRef = useRef<ListFormHandle>(null);

  const onCreated = (data?: { id: string }) => {
    if (!data) {
      throw new Error('Failed to create list');
    }
    navigateTo.viewList(me.userCode, data.id.toString());
    removeLocalStorage(LocalStorageKey.LIST_DRAFT);
  };

  const { mutate: createList } = usePostNewList({
    userCode: me.userCode,
    onSuccess: onCreated,
  });
  const { mutate: createCreatorList } = usePostCreatorList({
    userCode: me.userCode,
    onSuccess: onCreated,
  });

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigateTo.backward();
    }
  };

  // FEATURES.listLock 開啟走新的 POST /creator/lists（含 lock），關閉走舊的 POST /lists（去掉 lock）
  const onCreateList = withAuth(
    (formValues: z.infer<typeof ListFormSchema>) => {
      if (FEATURES.listLock) {
        createCreatorList(toCreatorListPostRequest(formValues));
      } else {
        createList({ body: ListBaseSchema.parse(formValues) });
      }
    }
  );

  useEffect(() => {
    checkAuthAndRedirect();
  }, [checkAuthAndRedirect]);

  return (
    <div className="flex min-h-screen flex-col gap-4">
      <EditModeHeader
        title={t`建立名單`}
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
