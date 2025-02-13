import useCreateIdea, { ICreateIdeaRequest } from '@/hooks/Ideas/useCreateIdea';
import IdeaForm from '@/pages/Idea/Components/Form';
import { Header } from '@/pages/Idea/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import { Trans } from '@lingui/macro';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface IdeaCreatePageProps {
  // Add any props you need for the page
}

const IdeaCreatePage: React.FC<IdeaCreatePageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { listID, listTitle } = location.state as {
    listID: number;
    listTitle: string;
  };
  const { setIsLoading } = useCommonStore();

  const { createIdeaLoading, ideaData, setIdeaData, fetchCreateIdea } =
    useCreateIdea();

  const onDismissCreate = (isFormEmpty: boolean) => {
    if (isFormEmpty) {
      navigate(`/list/manage/${listID}`);
    }
  };

  const onCreatedIdea = async (
    ideaFormData: Omit<ICreateIdeaRequest, 'listID'>
  ) => {
    const response = await fetchCreateIdea(ideaFormData);
    if (response) {
      navigate(`/list/manage/${listID}`);
    }
  };

  useEffect(() => {
    setIdeaData({ ...ideaData, listID });
  }, []);

  useEffect(() => {
    if (createIdeaLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [createIdeaLoading, setIsLoading]);

  return (
    // Your component code here
    <>
      <Header title={listTitle} />
      <div className="border-b border-black-text-01 bg-yellow-bright-01 px-4 py-3 text-t1 font-semibold">
        <Trans>New Idea</Trans>
      </div>
      <div className="mx-4 mt-6 flex flex-col gap-6">
        <IdeaForm
          completedCallback={onCreatedIdea}
          dismissCallback={onDismissCreate}
        />
      </div>
    </>
  );
};

export default IdeaCreatePage;
