'use client';

import IdeaFormComponent from '@/app/idea/_components/Form';
import { useGetIdea } from '@/hooks/api/ideas/useGetIdea';
import { usePutIdea } from '@/hooks/api/ideas/usePutIdea';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import useUserStore from '@/stores/useUserStore';
import { IdeaFormSchema } from '@/types/common';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import z from 'zod';

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

  const { mutate: editIdea } = usePutIdea({
    onSuccess: (data) => {
      navigateTo.viewList(me.userCode, data.listID);
    },
  });

  const onDismissEdit = (isFormNotEdited: boolean) => {
    if (idea && isFormNotEdited) {
      navigateTo.viewList(me.userCode, idea.listID.toString());
    }
  };

  const onEditIdea = withAuth((editedIdea: z.input<typeof IdeaFormSchema>) => {
    if (!id || !idea) {
      return;
    }
    const payload = { ...editedIdea };
    if (editedIdea.coverImage === idea.coverImage) {
      delete payload.coverImage;
    }

    editIdea({ params: { id }, body: { ...payload } });
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
    <div className="mt-14 flex min-h-screen flex-col gap-6 sm:min-h-[calc(100vh-102px)]">
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
