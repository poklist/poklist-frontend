import { IIdeaPreviewInfo } from '@/hooks/Lists/useGetList';
import { cn } from '@/lib/utils';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
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

  // const footerRef = useRef<HTMLDivElement>(null);

  // const footerPosition = () => {
  //   if (footerRef.current && window.visualViewport) {
  //     footerRef.current.style.top = `${window.visualViewport.height - footerRef.current.offsetHeight}px`;
  //   }
  // };
  // useEffect(() => {
  //   footerPosition();
  // }, []);

  return (
    <>
      <div className={cn('mb-6 flex flex-col gap-2')}>
        {ideaList?.map((idea, index) => (
          <DraggableIdeaRow
            idea={idea}
            key={`idea-${idea.id}`}
            index={index}
            hoverCallback={onReorderIdea}
          />
        ))}
      </div>
    </>
  );
};

export default IdeaListSection;
