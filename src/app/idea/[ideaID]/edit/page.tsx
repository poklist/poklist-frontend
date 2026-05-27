'use client';

import IdeaFormComponent from '@/app/idea/_components/Form';
import { useGetIdea } from '@/hooks/api/ideas/useGetIdea';
import useEditIdea from '@/hooks/mutations/useEditIdea';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import useUserStore from '@/stores/useUserStore';
import { IdeaBody } from '@/types/Idea';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const EditIdeaPage: React.FC = () => {
  const params = useParams();
  const id = params?.ideaID as string;
  const navigateTo = useStrictNavigationAdapter();

  const { me } = useUserStore();
  const { checkAuthAndRedirect } = useAuthCheck();
  const { withAuth } = useAuthWrapper();

  const {
    data: idea,
    isLoading: isIdeaLoading,
    isError: isIdeaError,
  } = useGetIdea({
    ideaID: id,
  });


  const { editIdea } = useEditIdea();

  const onDismissEdit = (isFormNotEdited: boolean) => {
    if (idea && isFormNotEdited) {
      navigateTo.viewList(me.userCode, idea.listID.toString());
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
        navigateTo.viewList(me.userCode, data.listID.toString());
      },
    });
  });

  useEffect(() => {
    checkAuthAndRedirect();
    if (isIdeaError) {
      navigateTo.home();
    }
    if (isIdeaLoading || !idea) {
      return;
    }
    if (idea.owner.userCode !== me.userCode) {
      navigateTo.viewList(idea.owner.userCode, idea.listID.toString());
    }
  }, [
    isIdeaError,
    isIdeaLoading,
    idea,
    me.userCode,
    navigateTo,
    checkAuthAndRedirect,
  ]);

  return (
    <div className="flex min-h-screen flex-col gap-6 sm:min-h-[calc(100vh-102px)] mt-14">
      {idea && (
        <IdeaFormComponent
          previousIdeaInfo={idea}
          dismissCallback={onDismissEdit}
          completedCallback={onEditIdea}
        />
      )}
    </div>
  );
};

export default EditIdeaPage;
