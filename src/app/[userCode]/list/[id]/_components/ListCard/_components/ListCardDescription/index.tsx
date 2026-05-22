import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { DESCRIPTION_PREVIEW_LENGTH } from '@/constants/list';
import { SocialLinkType } from '@/enums/index.enum';
import { openWindow } from '@/lib/openLink';
import { urlPreview } from '@/lib/utils';
import { useRef } from 'react';

interface ListCardDescriptionProps {
  description?: string;
  externalLink?: string;
  onExpandDescription: (content: React.ReactNode) => void;
}

export const ListCardDescription: React.FC<ListCardDescriptionProps> = ({
  description,
  externalLink,
  onExpandDescription,
}: ListCardDescriptionProps) => {
  const externalLinkRef = useRef<HTMLDivElement>(null);

  // FUTURE: refactor the drawer content because we may have more than one drawer
  const atClickDescription = () => {
    if (!description || description.length <= DESCRIPTION_PREVIEW_LENGTH)
      return;

    onExpandDescription(
      <div className="mx-6 mb-14 mt-6">
        {description}
        {externalLink && (
          <div className="mt-4 flex flex-nowrap items-center gap-2">
            <LinkIconWrapper variant={SocialLinkType.CUSTOMIZED} />
            <p className="line-clamp-1 block min-w-0 flex-1 truncate">
              {urlPreview(externalLink)}
            </p>
          </div>
        )}
      </div>
    );
  };

  const handleClickExternalLink = () => {
    if (!externalLink) return;

    const isTextTruncated =
      externalLinkRef.current &&
      externalLinkRef.current.scrollHeight >
        externalLinkRef.current.clientHeight;

    if (!isTextTruncated) {
      openWindow(externalLink);
      return;
    }

    onExpandDescription(
      <div className="flex h-8 cursor-pointer items-start gap-2 break-all px-2 text-[13px]">
        <LinkIconWrapper variant={SocialLinkType.CUSTOMIZED} />
        <a
          className="text-black-text-01"
          href={externalLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {externalLink}
        </a>
      </div>
    );
  };

  return (
    <>
      {description && (
        <div
          className="mt-6 line-clamp-1 block w-full truncate text-[15px] -tracking-1.1%"
          onClick={atClickDescription}
        >
          {description}
        </div>
      )}
      {externalLink && (
        <div
          className="mt-4 flex h-8 cursor-pointer items-center gap-2 self-start text-[13px]"
          onClick={handleClickExternalLink}
        >
          <LinkIconWrapper variant={SocialLinkType.CUSTOMIZED} />
          <p ref={externalLinkRef} className="line-clamp-1">
            {urlPreview(externalLink)}
          </p>
        </div>
      )}
    </>
  );
};
