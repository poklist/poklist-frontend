import { Button } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import { IIdeaPreviewInfo } from '@/hooks/Lists/useGetList';
import { cn } from '@/lib/utils';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/macro';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DraggableIdeaRow from './Idea';

interface IdeaListProps {
  // Add any props you need for the page
  ideaList?: IIdeaPreviewInfo[];
  reorderCallback: (dragIndex: number, hoverIndex: number) => void;
  confirmReorderCallback: () => void;
}

const IdeaListSection: React.FC<IdeaListProps> = ({
  ideaList,
  reorderCallback,
  confirmReorderCallback,
}) => {
  const userStore = useUserStore();
  const onReorderIdea = (dragIndex: number, hoverIndex: number) => {
    if (!ideaList) return;
    reorderCallback(dragIndex, hoverIndex);
  };

  const footerRef = useRef<HTMLDivElement>(null);

  const footerPosition = () => {
    if (footerRef.current && window.visualViewport) {
      footerRef.current.style.top = `${window.visualViewport.height - footerRef.current.offsetHeight}px`;
    }
  };
  useEffect(() => {
    footerPosition();
  }, []);

  return (
    <>
      <div className={cn('flex flex-col gap-2')}>
        {ideaList?.map((idea, index) => (
          <DraggableIdeaRow
            idea={idea}
            key={`idea-${idea.id}`}
            index={index}
            hoverCallback={onReorderIdea}
          />
        ))}
      </div>
      <div
        ref={footerRef}
        className="fixed left-0 z-10 flex w-dvw justify-between border-t border-t-gray-main-03 bg-white px-4 py-2"
      >
        <div className="flex items-center gap-2">
          <Link
            aria-label="Previous"
            className="h-auto rounded-full bg-inherit p-0"
            to={`/${userStore.user.userCode}`}
          >
            <IconClose />
          </Link>
          <Trans>Edit List</Trans>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => confirmReorderCallback()}
            variant="subActive"
            shape="rounded8px"
          >
            <Trans>Save New Order</Trans>
          </Button>
          <Button
            onClick={() => confirmReorderCallback()}
            variant="black"
            shape="rounded8px"
          >
            <Trans>Done</Trans>
          </Button>
        </div>
      </div>
    </>
  );
};

export default IdeaListSection;
