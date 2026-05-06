'use client';

import IdeaFormComponent from '@/app/idea/_components/Form';
import { useGetIdea } from '@/hooks/api/idea/useGetIdea';
import useEditIdea from '@/hooks/mutations/useEditIdea';
import { useList } from '@/hooks/queries/useList';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import useUserStore from '@/stores/useUserStore';
import { IdeaBody } from '@/types/Idea';
import { Skeleton, Text } from '@radix-ui/themes';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

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
    // enabled: !isDeleting,
  });

  const listID = useMemo(
    () => idea?.body?.listID.toString() ?? '',
    [idea?.body?.listID]
  );

  const { editIdea } = useEditIdea();
  const { data: list } = useList({
    listID,
  });

  const onDismissEdit = (isFormNotEdited: boolean) => {
    if (idea?.body && isFormNotEdited) {
      navigateTo.viewList(me.userCode, idea.body.listID.toString());
    }
  };

  const onEditIdea = withAuth((editedIdea: IdeaBody) => {
    if (!id || !idea?.body) {
      return;
    }
    const _params = { ...editedIdea, id: Number(id) };
    if (editedIdea.coverImage === idea.body.coverImage) {
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
    if (isIdeaLoading || !idea?.body) {
      return;
    }
    if (idea.body.owner.userCode !== me.userCode) {
      navigateTo.viewList(
        idea.body.owner.userCode,
        idea.body.listID.toString()
      );
    }
  }, [
    isIdeaError,
    isIdeaLoading,
    idea?.body,
    me.userCode,
    navigateTo,
    checkAuthAndRedirect,
  ]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex h-12 items-center border-b border-b-black bg-white px-4 text-[15px]">
          {list ? (
            list?.title
          ) : (
            <Text>
              <Skeleton>Skeleton Placeholder</Skeleton>
            </Text>
          )}
        </div>
      </div>
      <div className="flex min-h-screen flex-col gap-6 sm:min-h-[calc(100vh-102px)]">
        {idea?.body && (
          <IdeaFormComponent
            previousIdeaInfo={idea.body}
            dismissCallback={onDismissEdit}
            completedCallback={onEditIdea}
          />
        )}
      </div>
    </>
  );
};

export default EditIdeaPage;
