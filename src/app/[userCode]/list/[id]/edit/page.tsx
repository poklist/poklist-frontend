'use client';

import { GetUserListsResponse } from '@/api/query/lists';
import ListForm from '@/app/list/_components/Form';
import { useGetListInfiniteIdeas } from '@/hooks/api/lists/useGetListInfiniteIdeas';
import { usePutList } from '@/hooks/api/lists/usePutList';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';
import useUserStore from '@/stores/useUserStore';
import { ListBody } from '@/types/List';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EditListPage: React.FC = () => {
  const { userCode } = useUserRouteContext();
  const params = useParams();
  const listID = params?.id as string;
  const navigateTo = useStrictNavigationAdapter();
  const { checkAuthAndRedirect } = useAuthCheck();
  const { me } = useUserStore();
  const { withAuth } = useAuthWrapper();

  const { data: list } = useGetListInfiniteIdeas({
    listID,
    limit: 0,
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

  const onEditList = withAuth((listFormData: ListBody) => {
    if (!list) {
      return;
    }
    setListCoverDraft({
      ...list.pages[0].listInfo,
      title: listFormData.title,
      description: listFormData.description,
      externalLink: listFormData.externalLink,
      coverImage: listFormData.coverImage,
      categoryID: listFormData.categoryID,
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
    <div className="flex h-full flex-col gap-4">
      <ListForm
        defaultListInfo={listCoverDraft}
        dismissCallback={onDismissEdit}
        completedCallback={onEditList}
      />
    </div>
  );
};

export default EditListPage;
