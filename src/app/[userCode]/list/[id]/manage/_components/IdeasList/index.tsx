import IconDrag from '@/components/ui/icons/DragIcon';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { IdeaPreview } from '@/types/Idea';
import Image from 'next/image';
import React from 'react';
import VirtualList from 'react-virtual-sortable';
import { SortableEvent } from 'sortable-dnd';

interface IdeaListProps {
  ideaList?: IdeaPreview[];
  reorderCallback: (event: DropEvent<IdeaPreview>) => void;
  onBottomCallback: () => void;
  hasMore: boolean;
}

export interface DropEvent<T> {
  key: string | number;
  item: T;
  list: T[];
  event: SortableEvent;
  changed: boolean;
  oldList: T[];
  oldIndex: number;
  newIndex: number;
}

const IdeaListSection: React.FC<IdeaListProps> = ({
  ideaList,
  reorderCallback,
  onBottomCallback: atBottomCallback,
  hasMore,
}) => {
  const onReorderIdea = (event: DropEvent<IdeaPreview>) => {
    if (!ideaList) return;
    reorderCallback(event);
  };

  const navigateTo = useStrictNavigateNext();

  return (
    <div className="flex flex-col gap-2">
      {ideaList && (
        <VirtualList
          dataKey="id"
          dataSource={ideaList}
          onDrop={(event) => onReorderIdea(event)}
          onBottom={() => atBottomCallback()}
          footer={hasMore ? <Footer key="footer" /> : null}
          handle=".drag-handle"
          chosenClass="chosen"
          ghostClass="ghost"
          placeholderClass="placeholder"
          className="mb-14 max-h-[calc(100dvh-57px)]"
        >
          {(idea, _index, dataKey) => (
            <div
              key={dataKey}
              onClick={() => navigateTo.editIdea(idea.id.toString())}
              className="mb-2 border border-l-gray-main-03 bg-gray-note-05 px-4 py-2 last:mb-0"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="drag-handle min-h-6 min-w-6 cursor-move">
                    <IconDrag className="pointer-events-none" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-t1 font-semibold text-black-text-01">
                      {idea.title}
                    </div>
                    <div className="line-clamp-1 text-t3 text-black-tint-04">
                      {idea.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {idea.coverImage && (
                    <Image
                      src={idea.coverImage || ''}
                      width={40}
                      height={40}
                      className="h-10 max-h-10 min-h-10 w-10 min-w-10 max-w-10 flex-1 rounded border border-black-tint-04 bg-black object-contain"
                      alt={`Cover for ${idea.title}`}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </VirtualList>
      )}
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <div className="my-2 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-spin"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};

export default IdeaListSection;
