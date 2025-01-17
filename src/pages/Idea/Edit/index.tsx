import useDeleteIdea from '@/hooks/Ideas/useDeleteIdea';
import useEditIdea, { IEditIdeaRequest } from '@/hooks/Ideas/useEditIdea';
import useGetIdea from '@/hooks/Ideas/useGetIdea';
import useGetList from '@/hooks/Lists/useGetList';
import { Header } from '@/pages/Idea/Edit/Header';
import useCommonStore from '@/stores/useCommonStore';
import { Trans } from '@lingui/macro';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IdeaFormComponent from './Form';

interface EditIdeaPageProps {}
const EditIdeaPage: React.FC<EditIdeaPageProps> = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { setIsLoading } = useCommonStore();

  const { ideaInfo, isIdeaInfoLoading, fetchIdeaInfo } = useGetIdea();
  const { isDeleteIdeaLoading, fetchDeleteIdea } = useDeleteIdea();
  const { isEditIdeaLoading, fetchEditIdea } = useEditIdea();
  const { isListInfoLoading, listInfo, fetchGetListInfo } = useGetList();

  const onDeleteIdea = async () => {
    if (ideaInfo) {
      const response = await fetchDeleteIdea(ideaInfo.id);
      if (response) {
        navigate(`/list/manage/${ideaInfo.listID}`);
      }
    }
  };

  const onDismissEdit = (isFormNotEdited: boolean) => {
    if (isFormNotEdited) {
      navigate(`/idea/manage/${ideaInfo?.id}`);
    }
  };

  const onEditIdea = async (editedIdea: Omit<IEditIdeaRequest, 'id'>) => {
    if (!id) {
      return;
    }
    const _params = { ...editedIdea, id: Number(id) };
    const response = await fetchEditIdea(_params);
    if (response) {
      navigate(`/list/manage/${response.listID}`);
    }
  };

  useEffect(() => {
    if (id) {
      fetchIdeaInfo(id);
    }
  }, [id]);

  useEffect(() => {
    if (ideaInfo) {
      fetchGetListInfo(String(ideaInfo.listID));
    }
  }, [ideaInfo]);

  useEffect(() => {
    if (isIdeaInfoLoading) {
      setIsLoading(true);
    } else if (isDeleteIdeaLoading) {
      setIsLoading(true);
    } else if (isListInfoLoading) {
      setIsLoading(true);
    } else if (isEditIdeaLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isDeleteIdeaLoading, isListInfoLoading, isEditIdeaLoading, isIdeaInfoLoading, setIsLoading]);

  return (
    // Your component code here
    <>
      {listInfo && <div className="px-4 py-3 border-b-black border-b">{listInfo?.title}</div>}
      <Header title={<Trans>Idea</Trans>} deleteCallback={onDeleteIdea} />
      <div className="mt-4 flex flex-col gap-6 mx-4">
        <IdeaFormComponent
          previousIdeaInfo={ideaInfo}
          dismissCallback={onDismissEdit}
          completedCallback={onEditIdea}
        />
      </div>
    </>
  );
};

export default EditIdeaPage;
