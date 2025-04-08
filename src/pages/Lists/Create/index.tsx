import useCreateList, { ICreateListRequest } from '@/hooks/Lists/useCreateList';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import ListForm from '@/pages/Lists/Components/Form';
import Header from '@/pages/Lists/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/react/macro';
import React, { useEffect } from 'react';

interface CreatePageProps {
  // Add any props you need for the page
}

const CreatePage: React.FC<CreatePageProps> = () => {
  // Render the page here
  const navigateTo = useStrictNavigate();

  const { setIsLoading } = useCommonStore();
  const { user } = useUserStore();

  const { createListLoading, fetchCreateList } = useCreateList();

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigateTo.backward();
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
      navigateTo.manageList(user.userCode, response.id.toString());
    }
  };

  return (
    // Your component code here
    <>
      <Header title={<Trans>Idea List</Trans>} />
      <div className="flex min-h-screen flex-col gap-6">
        <ListForm
          completedCallback={onCreateList}
          dismissCallback={onDismissCreate}
        />
      </div>
    </>
  );
};

export default CreatePage;
