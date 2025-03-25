import useDeleteIdea from '@/hooks/Ideas/useDeleteIdea';
import useEditIdea, { IEditIdeaRequest } from '@/hooks/Ideas/useEditIdea';
import useGetIdea from '@/hooks/Ideas/useGetIdea';
import useGetList from '@/hooks/Lists/useGetList';
import Header from '@/pages/Idea/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import { Trans } from '@lingui/react/macro';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IdeaFormComponent from '../Components/Form';

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
      // TODO: error handling
      await fetchDeleteIdea(ideaInfo.id);
      navigate(`/${ideaInfo.owner.userCode}/list/${ideaInfo.listID}/manage`);
    }
  };

  const onDismissEdit = (isFormNotEdited: boolean) => {
    if (isFormNotEdited) {
      navigate(`/${ideaInfo?.owner.userCode}/list/${ideaInfo?.listID}/manage`);
    }
  };

  const onEditIdea = async (editedIdea: Omit<IEditIdeaRequest, 'id'>) => {
    if (!id) {
      return;
    }
    const _params = { ...editedIdea, id: Number(id) };
    const response = await fetchEditIdea(_params);
    if (response) {
      navigate(`/${ideaInfo?.owner.userCode}/list/${response.listID}/manage`);
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
  }, [
    isDeleteIdeaLoading,
    isListInfoLoading,
    isEditIdeaLoading,
    isIdeaInfoLoading,
    setIsLoading,
  ]);

  return (
    // Your component code here
    <>
      {listInfo && (
        <div className="border-b border-b-black px-4 py-3">
          {listInfo?.title}
        </div>
      )}
      <Header title={<Trans>Idea</Trans>} deleteCallback={onDeleteIdea} />
      <div className="mx-4 mt-4 flex flex-col gap-6">
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
