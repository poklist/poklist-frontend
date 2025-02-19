import { DragAndDropItems } from '@/constants/DragAndDrop';
import { IIdeaPreviewInfo } from '@/hooks/Lists/useGetList';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Link } from 'react-router-dom';

interface IdeaProps {
  idea: IIdeaPreviewInfo;
  index: number;
  hoverCallback: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableIdeaRow: React.FC<IdeaProps> = ({
  idea,
  index,
  hoverCallback,
}) => {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: DragAndDropItems.IDEA,
    item: { ...idea, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, dropRef] = useDrop<{ idea: IIdeaPreviewInfo; index: number }>(
    () => ({
      accept: DragAndDropItems.IDEA,
      collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
      hover(ideaInfo, monitor) {
        if (!ref.current) return;
        const dragIndex = ideaInfo.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) {
          return;
        }
        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        hoverCallback(dragIndex, hoverIndex);
        ideaInfo.index = hoverIndex;
      },
    })
  );

  dragRef(dropRef(ref));

  return (
    <Link
      ref={ref}
      to={`/idea/edit/${idea.id}`}
      key={`idea-${idea.id}`}
      className={cn(`border border-l-gray-main-03 bg-gray-note-05 px-4 py-2`, {
        'opacity-0': isDragging,
      })}
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
        {idea.coverImage && (
          <img
            src={idea.coverImage}
            className="h-10 max-h-10 min-h-10 w-10 min-w-10 max-w-10 flex-1 rounded border border-black-tint-04 bg-black object-contain"
            alt={`Cover for ${idea.title}`}
          />
        )}
      </div>
    </Link>
  );
};

export default DraggableIdeaRow;
