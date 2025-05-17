import { useCreateList } from '@/hooks/mutations/useCreateList';
import useStrictNavigation from '@/hooks/useStrictNavigate';
import ListForm from '@/pages/Lists/Components/Form';
import Header from '@/pages/Lists/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { ListBody } from '@/types/List';
import { Trans } from '@lingui/react/macro';
import React, { useEffect } from 'react';

interface CreatePageProps {
  // Add any props you need for the page
}

const CreatePage: React.FC<CreatePageProps> = () => {
  const navigateTo = useStrictNavigation();
  const { setIsLoading } = useCommonStore();
  const { me } = useUserStore();

  const { createList, isCreateListLoading } = useCreateList({
    userCode: me.userCode,
  });

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigateTo.backward();
    }
  };

  useEffect(() => {
    if (isCreateListLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isCreateListLoading, setIsLoading]);

  const onCreateList = async (listData: ListBody) => {
    createList(listData, {
      onSuccess: (data) => {
        if (!data) {
          throw new Error('Failed to create list');
        }
        navigateTo.manageList(me.userCode, data.id.toString());
      },
    });
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
