import useDeleteList from '@/hooks/Lists/useDeleteList';
import useEditList, { IEditListRequest } from '@/hooks/Lists/useEditList';
import ListForm from '@/pages/Lists/Edit/Form';
import { Header } from '@/pages/Lists/Edit/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/macro';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface EditListPageProps {
  // Add any props you need for the page
}

const EditListPage: React.FC<EditListPageProps> = () => {
  // Render the page here
  const { id } = useParams();
  const navigate = useNavigate();

  const { setIsLoading } = useCommonStore();
  const userStore = useUserStore();

  const { editListLoading, listInfo, setListInfo, initialListInfo, fetchEditList } = useEditList();
  const { deleteListLoading, fetchDeleteList } = useDeleteList();

  const onDeleteList = async () => {
    if (listInfo) {
      const response = await fetchDeleteList(listInfo.listID);
      if (response) {
        navigate(`/${userStore.user.id}`);
      }
    }
  };

  const onDismissEdit = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigate(`/list/manage/${listInfo?.listID}`);
    }
  };

  const onEditList = async (listFormData: Omit<IEditListRequest, 'listID'>) => {
    if (!listInfo) {
      return;
    }
    setListInfo({
      ...listInfo,
      title: listFormData.title,
      description: listFormData.description,
      externalLink: listFormData.externalLink,
      coverImage: listFormData.coverImage,
      categoryID: listFormData.categoryID,
    });
    const response = await fetchEditList(listFormData);
    if (response) {
      navigate(`/list/manage/${response.id}`);
      return;
    }
  };
  useEffect(() => {
    if (id) {
      initialListInfo(id);
    }
  }, [id]);

  useEffect(() => {
    if (editListLoading) {
      setIsLoading(true);
    } else if (deleteListLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [editListLoading, deleteListLoading, setIsLoading]);

  return (
    // Your component code here
    <>
      <Header title={<Trans>List Title</Trans>} deleteCallback={onDeleteList} />
      <div className="mt-6 flex flex-col gap-6 mx-4">
        <ListForm
          defaultListInfo={listInfo}
          dismissCallback={onDismissEdit}
          completedCallback={onEditList}
        />
      </div>
    </>
  );
};

export default EditListPage;
