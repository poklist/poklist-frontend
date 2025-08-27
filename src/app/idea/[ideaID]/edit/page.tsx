'use client';

import IdeaFormComponent from '@/app/idea/_components/Form';
import Header from '@/app/idea/_components/Header';
import useDeleteIdea from '@/hooks/mutations/useDeleteIdea';
import useEditIdea from '@/hooks/mutations/useEditIdea';
import { useIdea } from '@/hooks/queries/useIdea';
import { useList } from '@/hooks/queries/useList';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaBody } from '@/types/Idea';
import { Trans } from '@lingui/react/macro';
import { Skeleton, Text } from '@radix-ui/themes';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const EditIdeaPage: React.FC = () => {
  const params = useParams();
  const id = params?.ideaID as string;
  const navigateTo = useStrictNavigationAdapter();
  const [isDeleting, setIsDeleting] = useState(false);

  const { setIsLoading } = useCommonStore();
  const { me } = useUserStore();
  const { checkAuthAndRedirect } = useAuthCheck();
  const { withAuth } = useAuthWrapper();

  const {
    idea,
    isLoading: isIdeaLoading,
    isError: isIdeaError,
  } = useIdea({
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
  }, [isDeleteIdeaLoading, isListLoading, isEditIdeaLoading, isIdeaLoading]);

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
