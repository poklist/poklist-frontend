import { ICreateListRequest } from '@/hooks/Lists/useCreateList';
import useDeleteList from '@/hooks/Lists/useDeleteList';
import useEditList, { IEditListRequest } from '@/hooks/Lists/useEditList';
import useGetList from '@/hooks/Lists/useGetList';
import { base64ToFile } from '@/lib/utils';
import ListForm from '@/pages/Lists/Components/Form';
import { Header } from '@/pages/Lists/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
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

  const { isListInfoLoading, fetchGetListInfo } = useGetList();
  const { editListLoading, fetchEditList } = useEditList();
  const { deleteListLoading, fetchDeleteList } = useDeleteList();

  const [listInfo, setListInfo] = useState<IEditListRequest>();

  const onDeleteList = async () => {
    if (listInfo) {
      const response = await fetchDeleteList(listInfo.listID);
      if (response === null) {
        navigate(`/${userStore.user.userCode}`);
      }
    }
  };

  const onDismissEdit = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigate(`/list/manage/${listInfo?.listID}`);
    }
  };

  const onEditList = async (listFormData: ICreateListRequest) => {
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
    const response = await fetchEditList(Number(id), listFormData);
    if (response) {
      navigate(`/list/manage/${response.id}`);
      return;
    }
  };
  useEffect(() => {
    if (id) {
      const _fetchGetListInfo = async () => {
        const response = await fetchGetListInfo(id);
        if (response) {
          const coverImage =
            response.coverImage.length > 0
              ? await base64ToFile(response.coverImage)
              : null;
          setListInfo({
            listID: response.id,
            title: response.title,
            description: response.description,
            externalLink: response.externalLink,
            coverImage,
            categoryID: response.categoryID,
          });
        }
      };
      _fetchGetListInfo();
    }
  }, [id]);

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

  return (
    // Your component code here
    <>
      <Header title={<Trans>Idea List</Trans>} deleteCallback={onDeleteList} />
      <div className="mx-4 mt-6 flex flex-col gap-6">
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
