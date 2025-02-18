import { Button } from '@/components/ui/button';
import IconLink from '@/components/ui/icons/LinkIcon';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { SocialLinkType } from '@/enums/index.enum';
import { getFormattedTime } from '@/lib/time';
import { copyHref, getPreviewText, urlPreview } from '@/lib/utils';
import { IdeaDetail } from '@/types/Idea';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

interface IIdeaDrawerContentProps {
  data: IdeaDetail;
}

const LINK_PREVIEW_LENGTH = 40;

const IdeaDrawerContent: React.FC<IIdeaDrawerContentProps> = ({ data }) => {
  const { i18n } = useLingui();

  return (
    <div className="flex flex-col items-center">
      {data.coverImage && (
        <img
          src={data.coverImage}
          alt={data.title}
          width={240}
          height={240}
          className="mt-6 rounded-[12px] border border-black"
        />
      )}
      <div className="-tracking-2% mt-6 self-start text-[17px] font-bold">
        {data.title}
      </div>
      {data.description && (
        <div className="mt-1 text-[15px] leading-[1.45] -tracking-1.1%">
          {data.description}
        </div>
      )}
      {data.externalLink && (
        <div
          className="mt-4 flex h-8 cursor-pointer items-center gap-2 self-start text-[13px]"
          onClick={() => {
            window.open(data.externalLink, '_blank');
          }}
        >
          <LinkIconWrapper variant={SocialLinkType.CUSTOMIZED} />
          <p>
            {getPreviewText(urlPreview(data.externalLink), LINK_PREVIEW_LENGTH)}
          </p>
        </div>
      )}
      <div className="mt-4 flex w-full items-center justify-between">
        <p className="text-[13px] text-black-text-01">
          {getFormattedTime(data.createdAt, i18n.locale)}
        </p>
        <Button
          variant="white"
          shape="roundedFull"
          size="md"
          className="flex gap-1"
          onClick={() => {
            copyHref(`/idea/${data.id}`);
          }}
        >
          <IconLink />
          <Trans>Copy</Trans>
        </Button>
      </div>
    </div>
  );
};

export default IdeaDrawerContent;
