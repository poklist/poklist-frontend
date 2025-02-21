import useCreateList, { ICreateListRequest } from '@/hooks/Lists/useCreateList';
import ListForm from '@/pages/Lists/Components/Form';
import Header from '@/pages/Lists/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/macro';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreatePageProps {
  // Add any props you need for the page
}

const CreatePage: React.FC<CreatePageProps> = () => {
  // Render the page here
  const navigate = useNavigate();

  const { setIsLoading } = useCommonStore();
  const userStore = useUserStore();

  const { createListLoading, fetchCreateList } = useCreateList();

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigate(`/${userStore.user.userCode}`);
    }
  };

  useEffect(() => {
    if (createListLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [createListLoading, setIsLoading]);

  const onCreateList = async (listData: ICreateListRequest) => {
    const response = await fetchCreateList(listData);
    if (response) {
      navigate(`/list/manage/${response.id}`);
    }
  };

  return (
    // Your component code here
    <>
      <Header title={<Trans>Idea List</Trans>} />
      <div className="mx-4 mt-6 flex flex-col gap-6">
        <ListForm
          completedCallback={onCreateList}
          dismissCallback={onDismissCreate}
        />
      </div>
    </>
  );
};

export default CreatePage;
