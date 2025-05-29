import useDeleteIdea from '@/hooks/mutations/useDeleteIdea';
import useEditIdea from '@/hooks/mutations/useEditIdea';
import { useIdea } from '@/hooks/queries/useIdea';
import { useList } from '@/hooks/queries/useList';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigation from '@/hooks/useStrictNavigate';
import Header from '@/pages/Idea/Components/Header';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaBody } from '@/types/Idea';
import { Trans } from '@lingui/react/macro';
import { Skeleton, Text } from '@radix-ui/themes';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import IdeaFormComponent from '../Components/Form';

const EditIdeaPage: React.FC = () => {
  const { id } = useParams();
  const navigateTo = useStrictNavigation();
  const [isDeleting, setIsDeleting] = useState(false);

  const { setIsLoading } = useCommonStore();
  const { me } = useUserStore();
  const { withAuth } = useAuthWrapper();

  const { idea, isLoading: isIdeaLoading } = useIdea({
    ideaID: id,
    enabled: !isDeleting,
  });
  const listID = useMemo(() => idea?.listID.toString() ?? '', [idea?.listID]);

  const { deleteIdea, isDeleteIdeaLoading } = useDeleteIdea({
    listID,
  });
  const { editIdea, isEditIdeaLoading } = useEditIdea();
  const { data: list, isLoading: isListLoading } = useList({
    listID,
  });

  const onDeleteIdea = withAuth(() => {
    if (idea) {
      setIsDeleting(true);
      deleteIdea(idea.id, {
        onSuccess: () => {
          navigateTo.manageList(me.userCode, listID);
        },
      });
    }
  });

  const onDismissEdit = (isFormNotEdited: boolean) => {
    if (idea && isFormNotEdited) {
      navigateTo.manageList(me.userCode, idea.listID.toString());
    }
  };

  const onEditIdea = withAuth((editedIdea: IdeaBody) => {
    if (!id || !idea) {
      return;
    }
    const _params = { ...editedIdea, id: Number(id) };
    if (editedIdea.coverImage === idea.coverImage) {
      delete _params.coverImage;
    }
    editIdea(_params, {
      onSuccess: (data) => {
        navigateTo.manageList(me.userCode, data.listID.toString());
      },
    });
  });

  useEffect(() => {
    if (
      isIdeaLoading ||
      isDeleteIdeaLoading ||
      isListLoading ||
      isEditIdeaLoading
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [
    isDeleteIdeaLoading,
    isListLoading,
    isEditIdeaLoading,
    isIdeaLoading,
    setIsLoading,
  ]);

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-col">
        <div className="flex h-12 items-center border-b border-b-black bg-white px-4 text-[15px]">
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
          previousIdeaInfo={idea}
          dismissCallback={onDismissEdit}
          completedCallback={onEditIdea}
        />
      </div>
    </>
  );
};

export default EditIdeaPage;
