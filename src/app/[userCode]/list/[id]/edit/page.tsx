'use client';

import { useDeleteList } from '@/hooks/mutations/useDeleteList';
import { useEditList } from '@/hooks/mutations/useEditList';
import { useList } from '@/hooks/queries/useList';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateAdapter';
import { useUserContext } from '@/hooks/useRouterCompat';
import ListForm from '../../_components/Form';
import Header from '../../_components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { ListBody, ListCover } from '@/types/List';
import { Trans } from '@lingui/react/macro';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const EditListPage: React.FC = () => {
  const { userCode } = useUserContext();
  const params = useParams();
  const listID = params?.id as string;
  const navigateTo = useStrictNavigationAdapter();
  const { checkAuthAndRedirect } = useAuthCheck();
  const { setIsLoading } = useCommonStore();
  const { me } = useUserStore();
  const { withAuth } = useAuthWrapper();

  const { data: list, isLoading: isListInfoLoading } = useList({
    listID: listID,
  });
  const { isEditListLoading, editList } = useEditList({
    userCode: me.userCode,
  });
  const { deleteList, isDeleteListLoading } = useDeleteList({
    userCode: me.userCode,
  });

  const [listCoverDraft, setListCoverDraft] = useState<ListCover>();

  const onDeleteList = withAuth(() => {
    if (list) {
      deleteList(list.id, {
        onSuccess: () => {
          navigateTo.user(me.userCode);
          setIsLoading(false);
        },
      });
    }
  });

  const onDismissEdit = (isFormEmpty: boolean) => {
    if (list && isFormEmpty) {
      navigateTo.manageList(me.userCode, list.id.toString());
    }
  };

  const onEditList = withAuth((listFormData: ListBody) => {
    if (!list) {
      return;
    }
    setListCoverDraft({
      ...list,
      title: listFormData.title,
      description: listFormData.description,
      externalLink: listFormData.externalLink,
      coverImage: listFormData.coverImage,
      categoryID: listFormData.categoryID,
    });
    editList(
      {
        listID: Number(listID),
        editListRequest: listFormData,
      },
      {
        onSuccess: (data) => {
          if (!data) {
            throw new Error('Failed to edit list');
          }
          navigateTo.manageList(me.userCode, data.id.toString());
        },
      }
    );
  });

  useEffect(() => {
    if (isEditListLoading || isDeleteListLoading || isListInfoLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isEditListLoading, isDeleteListLoading, isListInfoLoading, setIsLoading]);

  useEffect(() => {
    if (list) {
      setListCoverDraft(list);
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
  }, [checkAuthAndRedirect, listID, me.userCode, navigateTo, userCode]);

  return (
    <>
      <Header title={<Trans>List Cover</Trans>} deleteCallback={onDeleteList} />
      <div className="flex h-full flex-col gap-6">
        <ListForm
          defaultListInfo={listCoverDraft}
          dismissCallback={onDismissEdit}
          completedCallback={onEditList}
        />
      </div>
    </>
  );
};

export default EditListPage;
