import { ICreateListRequest } from '@/hooks/Lists/useCreateList';
import useDeleteList from '@/hooks/Lists/useDeleteList';
import useEditList, { IEditListRequest } from '@/hooks/Lists/useEditList';
import useGetList from '@/hooks/Lists/useGetList';
import ListForm from '@/pages/Lists/Components/Form';
import Header from '@/pages/Lists/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/react/macro';
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
      // TODO: error handling
      await fetchDeleteList(listInfo.listID);
      navigate(`/${userStore.user.userCode}`);
      setIsLoading(false);
    }
  };

  const onDismissEdit = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigate(`/${userStore.user.userCode}/list/${listInfo?.listID}`);
    }
  };

  const onBackward = () => {
    navigate(-1);
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
      navigate(`/${userStore.user.userCode}/list/${response.id}/manage`);
      return;
    }
  };
  useEffect(() => {
    if (id) {
      const _fetchGetListInfo = async () => {
        const response = await fetchGetListInfo(id);
        if (response) {
          setListInfo({
            listID: response.id,
            title: response.title,
            description: response.description,
            externalLink: response.externalLink,
            coverImage: response.coverImage,
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
      <Header
        title={<Trans>List Cover</Trans>}
        deleteCallback={onDeleteList}
        backwardCallback={onBackward}
      />
      <div className="flex h-full flex-col gap-6">
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
