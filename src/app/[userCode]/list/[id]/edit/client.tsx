'use client';

import { GetUserListsResponse } from '@/api/query/lists';
import ListForm, { ListFormHandle } from '@/app/list/_components/Form';
import EditModeHeader from '@/components/Header/EditModeHeader';
import { useGetListInfiniteIdeas } from '@/hooks/api/lists/useGetListInfiniteIdeas';
import { usePutList } from '@/hooks/api/lists/usePutList';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';
import useUserStore from '@/stores/useUserStore';
import { ListBaseSchema, ListFormSchema } from '@/types/common';
import { t } from '@lingui/macro';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import z from 'zod';

const EditListPage: React.FC = () => {
  const { userCode } = useUserRouteContext();
  const params = useParams();
  const listID = params?.id as string;
  const navigateTo = useStrictNavigationAdapter();
  const { checkAuthAndRedirect } = useAuthCheck();
  const { me } = useUserStore();
  const { withAuth } = useAuthWrapper();

  const formRef = useRef<ListFormHandle>(null);

  const { data: list } = useGetListInfiniteIdeas({
    listID,
    // 編輯頁只要 list meta，不需 ideas。
    // limit 不可設 0 —— 後端視為未指定並回傳整批 ideas。
    limit: 1,
  });
  const { mutate: editList } = usePutList({
    userCode: me.userCode,
    onSuccess: (data) => {
      if (!data) {
        throw new Error('Failed to edit list');
      }
      navigateTo.viewList(me.userCode, data.id);
    },
  });

  const [listCoverDraft, setListCoverDraft] =
    useState<GetUserListsResponse['content'][number]>();

  const onDismissEdit = (isFormEmpty: boolean) => {
    if (list && isFormEmpty) {
      navigateTo.viewList(me.userCode, list.pages[0].listInfo.id);
    }
  };

  const onEditList = withAuth((formValues: z.infer<typeof ListFormSchema>) => {
    if (!list) {
      return;
    }
    // 編輯在階段 5 前一律走舊 PUT /lists：舊 API 不接受 lock，以 ListBaseSchema 去掉（zod 會移除未定義的 key）
    const listFormData = ListBaseSchema.parse(formValues);
    setListCoverDraft({
      ...list.pages[0].listInfo,
      title: listFormData.title,
      description: listFormData.description,
      externalLink: listFormData.externalLink,
      coverImage: listFormData.coverImage,
      categoryID: listFormData.categoryID,
      type: listFormData.type,
    });
    editList({
      params: { listID },
      body: listFormData,
    });
  });

  useEffect(() => {
    if (list) {
      setListCoverDraft(list.pages[0].listInfo);
    }
  }, [list]);

  useEffect(() => {
    checkAuthAndRedirect();
    if (userCode !== me.userCode) {
      if (userCode) {
        if (listID) {
          navigateTo.viewList(userCode, listID);
        } else {
          navigateTo.user(userCode);
        }
      } else {
        navigateTo.home();
      }
    }
  }, [listID, me.userCode, userCode]);

  return (
    <div className="flex h-full flex-col gap-2">
      <EditModeHeader
        title={t`編輯名單`}
        onClose={() => formRef.current?.requestClose()}
      />
      <ListForm
        ref={formRef}
        isEdit
        defaultListInfo={listCoverDraft}
        dismissCallback={onDismissEdit}
        completedCallback={onEditList}
      />
    </div>
  );
};

export default EditListPage;
