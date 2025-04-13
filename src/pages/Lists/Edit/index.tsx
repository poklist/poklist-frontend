import { ICreateListRequest } from '@/hooks/Lists/useCreateList';
import useDeleteList from '@/hooks/Lists/useDeleteList';
import useEditList from '@/hooks/Lists/useEditList';
import { useList } from '@/hooks/queries/useList';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import ListForm from '@/pages/Lists/Components/Form';
import Header from '@/pages/Lists/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { ListCover } from '@/types/List';
import { Trans } from '@lingui/react/macro';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface EditListPageProps {
  // Add any props you need for the page
}

const EditListPage: React.FC<EditListPageProps> = () => {
  // Render the page here
  const { id } = useParams();
  const navigateTo = useStrictNavigate();

  const { setIsLoading } = useCommonStore();
  const userStore = useUserStore();

  const { data: list, isLoading: isListInfoLoading } = useList({
    listID: id,
  });
  const { editListLoading, fetchEditList } = useEditList();
  const { deleteListLoading, fetchDeleteList } = useDeleteList();

  const [listCoverDraft, setListCoverDraft] = useState<ListCover>();

  const onDeleteList = async () => {
    if (list) {
      // TODO: error handling
      await fetchDeleteList(list.id);
      navigateTo.user(userStore.user.userCode);
      setIsLoading(false);
    }
  };

  const onDismissEdit = (isFormEmpty: boolean) => {
    if (list && isFormEmpty) {
      navigateTo.manageList(userStore.user.userCode, list.id.toString());
    }
  };

  const onBackward = () => {
    navigateTo.backward();
  };

  const onEditList = async (listFormData: ICreateListRequest) => {
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
    const response = await fetchEditList(Number(id), listFormData);
    if (response) {
      navigateTo.manageList(userStore.user.userCode, response.id.toString());
      return;
    }
  };

  useEffect(() => {
    if (editListLoading) {
      setIsLoading(true);
    } else if (deleteListLoading) {
      setIsLoading(true);
    } else if (isListInfoLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [editListLoading, deleteListLoading, isListInfoLoading, setIsLoading]);

  useEffect(() => {
    if (list) {
      setListCoverDraft(list);
    }
  }, [list]);

  return (
    // Your component code here
    <>
      <Header
        title={<Trans>List Cover</Trans>}
        deleteCallback={onDeleteList}
        backwardCallback={onBackward}
      />
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
