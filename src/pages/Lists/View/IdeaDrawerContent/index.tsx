import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import IconLink from '@/components/ui/icons/LinkIcon';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { SocialLinkType } from '@/enums/index.enum';
import { useToast } from '@/hooks/useToast';
import { getFormattedTime } from '@/lib/time';
import { copyHref, urlPreview } from '@/lib/utils';
import { IdeaDetail } from '@/types/Idea';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

interface IIdeaDrawerContentProps {
  data: IdeaDetail;
}

const LINK_PREVIEW_LENGTH = 40;

const IdeaDrawerContent: React.FC<IIdeaDrawerContentProps> = ({ data }) => {
  const { i18n } = useLingui();
  const { toast } = useToast();

  const handleCopyHref = () => {
    copyHref(`/idea/${data.id}`);
    toast({
      title: t`Copied to clipboard`,
      variant: 'success',
    });
  };

  return (
    <div className="flex flex-col items-start">
      {data.coverImage && (
        <img
          src={data.coverImage}
          alt={data.title}
          width={240}
          height={240}
          className="mt-6 self-center rounded-[12px] border border-black"
        />
      )}
      <div className="-tracking-2% mt-6 text-[17px] font-bold leading-[1.45]">
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
          <p className="line-clamp-1 max-w-[160px]">
            {urlPreview(data.externalLink)}
          </p>
        </div>
      )}
      <div className="mt-4 flex w-full items-center justify-between">
        <p className="text-[13px] text-black-text-01">
          {getFormattedTime(data.createdAt, i18n.locale)}
        </p>
        <Button
          variant={ButtonVariant.WHITE}
          shape={ButtonShape.ROUNDED_FULL}
          size={ButtonSize.MD}
          className="flex gap-1"
          onClick={handleCopyHref}
        >
          <IconLink />
          <Trans>Copy</Trans>
        </Button>
      </div>
    </div>
  );
};

export default IdeaDrawerContent;
