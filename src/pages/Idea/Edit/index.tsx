import useDeleteIdea from '@/hooks/Ideas/useDeleteIdea';
import useEditIdea, { IEditIdeaRequest } from '@/hooks/Ideas/useEditIdea';
import useGetIdea from '@/hooks/Ideas/useGetIdea';
import { useList } from '@/hooks/queries/useList';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import Header from '@/pages/Idea/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/react/macro';
import { Skeleton, Text } from '@radix-ui/themes';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import IdeaFormComponent from '../Components/Form';

interface EditIdeaPageProps {}
const EditIdeaPage: React.FC<EditIdeaPageProps> = () => {
  const { id } = useParams();
  const navigateTo = useStrictNavigate();

  const { setIsLoading } = useCommonStore();
  const { user: me } = useUserStore();

  const { ideaInfo, isIdeaInfoLoading, fetchIdeaInfo } = useGetIdea();
  const { isDeleteIdeaLoading, fetchDeleteIdea } = useDeleteIdea();
  const { isEditIdeaLoading, fetchEditIdea } = useEditIdea();
  const { data: list, isLoading: isListLoading } = useList({
    listID: ideaInfo?.listID.toString(),
  });

  const onDeleteIdea = async () => {
    if (ideaInfo) {
      // TODO: error handling
      await fetchDeleteIdea(ideaInfo.id);
      navigateTo.manageList(me.userCode, ideaInfo.listID.toString());
    }
  };

  const onDismissEdit = (isFormNotEdited: boolean) => {
    if (ideaInfo && isFormNotEdited) {
      navigateTo.manageList(me.userCode, ideaInfo.listID.toString());
    }
  };

  const onEditIdea = async (editedIdea: Omit<IEditIdeaRequest, 'id'>) => {
    if (!id) {
      return;
    }
    const _params = { ...editedIdea, id: Number(id) };
    const response = await fetchEditIdea(_params);
    if (response) {
      navigateTo.manageList(me.userCode, response.listID.toString());
    }
  };

  useEffect(() => {
    if (id) {
      fetchIdeaInfo(id);
    }
  }, [id]);

  useEffect(() => {
    if (isIdeaInfoLoading) {
      setIsLoading(true);
    } else if (isDeleteIdeaLoading) {
      setIsLoading(true);
    } else if (isListLoading) {
      setIsLoading(true);
    } else if (isEditIdeaLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [
    isDeleteIdeaLoading,
    isListLoading,
    isEditIdeaLoading,
    isIdeaInfoLoading,
    setIsLoading,
  ]);

  return (
    // Your component code here
    <>
      <div className="sticky top-0 z-10 flex flex-col">
        <div className="flex h-12 items-center border-b border-b-black px-4 text-[15px]">
          {list ? (
            list?.title
          ) : (
            <Text>
              <Skeleton>Skeleton Placeholder</Skeleton>
            </Text>
          )}
        </div>
        <Header title={<Trans>Idea</Trans>} deleteCallback={onDeleteIdea} />
      </div>
      <div className="flex min-h-screen flex-col gap-6 sm:min-h-[calc(100vh-102px)]">
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
