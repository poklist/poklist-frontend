import useStrictNavigate from '@/hooks/useStrictNavigate';
import { IdeaPreview } from '@/types/Idea';
import React from 'react';
import VirtualList from 'react-virtual-sortable';
import { SortableEvent } from 'sortable-dnd';

interface IdeaListProps {
  // Add any props you need for the page
  ideaList?: IdeaPreview[];
  reorderCallback: (event: DropEvent<IdeaPreview>) => void;
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
}) => {
  const onReorderIdea = (event: DropEvent<IdeaPreview>) => {
    if (!ideaList) return;
    reorderCallback(event);
  };

  const navigateTo = useStrictNavigate();

  return (
    <div className="flex flex-col gap-2">
      {ideaList && (
        <VirtualList
          dataKey="id"
          dataSource={ideaList}
          onDrop={(event) => onReorderIdea(event)}
          handle=".drag-handle"
          chosenClass="chosen"
          ghostClass="ghost"
          placeholderClass="placeholder"
          className="h-screen"
        >
          {(idea) => (
            <div
              onClick={() => navigateTo.editIdea(idea.id.toString())}
              key={`idea-${idea.id}`}
              className="mb-2 border border-l-gray-main-03 bg-gray-note-05 px-4 py-2 last:mb-0"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <div className="text-t1 font-semibold text-black-text-01">
                    {idea.title}
                  </div>
                  <div className="line-clamp-1 text-t3 text-black-tint-04">
                    {idea.description}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {idea.coverImage && (
                    <img
                      src={idea.coverImage}
                      className="h-10 max-h-10 min-h-10 w-10 min-w-10 max-w-10 flex-1 rounded border border-black-tint-04 bg-black object-contain"
                      alt={`Cover for ${idea.title}`}
                    />
                  )}
                  <div className="drag-handle cursor-move">
                    <svg
                      className="pointer-events-none h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 21 21"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 7.5h12m-12.002 3h11.997M4.5 13.5h11.995"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </VirtualList>
      )}
    </div>
  );
};

export default IdeaListSection;
