import { useDeleteList } from '@/hooks/mutations/useDeleteList';
import { useEditList } from '@/hooks/mutations/useEditList';
import { useList } from '@/hooks/queries/useList';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigation from '@/hooks/useStrictNavigate';
import ListForm from '@/pages/Lists/Components/Form';
import Header from '@/pages/Lists/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { ListBody, ListCover } from '@/types/List';
import { Trans } from '@lingui/react/macro';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EditListPage: React.FC = () => {
  // Render the page here
  const { id } = useParams();
  const navigateTo = useStrictNavigation();

  const { setIsLoading } = useCommonStore();
  const userStore = useUserStore();
  const { withAuth } = useAuthWrapper();

  const { data: list, isLoading: isListInfoLoading } = useList({
    listID: id,
  });
  const { isEditListLoading, editList } = useEditList({
    userCode: userStore.me.userCode,
  });
  const { deleteList, isDeleteListLoading } = useDeleteList({
    userCode: userStore.me.userCode,
  });

  const [listCoverDraft, setListCoverDraft] = useState<ListCover>();

  const onDeleteList = withAuth(() => {
    if (list) {
      deleteList(list.id, {
        onSuccess: () => {
          navigateTo.user(userStore.me.userCode);
          setIsLoading(false);
        },
      });
    }
  });

  const onDismissEdit = (isFormEmpty: boolean) => {
    if (list && isFormEmpty) {
      navigateTo.manageList(userStore.me.userCode, list.id.toString());
    }
  };

  const onEditList = withAuth((listFormData: ListBody) => {
    if (!list) {
      return;
    }
    // TODO: maybe no need to update listCoverDraft
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
        listID: Number(id),
        editListRequest: listFormData,
      },
      {
        onSuccess: (data) => {
          if (!data) {
            throw new Error('Failed to edit list');
          }
          navigateTo.manageList(userStore.me.userCode, data.id.toString());
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

  return (
    // Your component code here
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
