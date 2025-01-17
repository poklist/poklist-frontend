import { Button } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import { IIdeaPreviewInfo } from '@/hooks/Lists/useGetList';
import { Trans } from '@lingui/macro';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface IdeaListProps {
  // Add any props you need for the page
  ideaList: IIdeaPreviewInfo[] | undefined;
}

const IdeaListSection: React.FC<IdeaListProps> = ({ ideaList }) => {
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
      <div className="flex flex-col gap-2">
        {ideaList?.map(idea => (
          <Link
            to={`/idea/edit/${idea.id}`}
            key={`idea-${idea.id}`}
            className="border border-l-gray-main-03 bg-gray-note-05 py-2 px-4"
          >
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-col">
                <div className="text-black-text-01 font-semibold text-t1">{idea.title}</div>
                <div className="line-clamp-1 text-t3 text-black-tint-04">{idea.description}</div>
              </div>
              {idea.coverImage && (
                <img
                  src={idea.coverImage}
                  className="w-10 h-10 rounded border-black-tint-04 border"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
      <div
        ref={footerRef}
        className="border-t-gray-main-03 border-t fixed flex px-4 py-2 w-dvw justify-between left-0 z-10"
      >
        <div className="flex items-center gap-2">
          <Button aria-label="Previous" className="p-0 h-auto rounded-full bg-inherit">
            <IconClose />
          </Button>
          <Trans>Edit List</Trans>
        </div>
        <div className="flex items-center gap-4">
          <Button disabled variant="black" shape="rounded8px">
            <Trans>Save New Order</Trans>
          </Button>
          <Button variant="black" shape="rounded8px">
            <Trans>Done</Trans>
          </Button>
        </div>
      </div>
    </>
  );
};

export default IdeaListSection;
