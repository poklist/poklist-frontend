import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import IconAdd from '@/components/ui/icons/AddIcon';
import IconLike from '@/components/ui/icons/LikeIcon';
import IconLink from '@/components/ui/icons/LinkIcon';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { useToast } from '@/hooks/useToast';
import { cn, copyHref } from '@/lib/utils';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';

interface IFooterProps {
  hasLikeButton?: boolean;
  isLiked?: boolean;
  onClickLike?: () => void;
  onClickUnlike?: () => void;
  hasCreateListButton?: boolean;
}

const FloatingButtonFooter: React.FC<IFooterProps> = ({
  hasLikeButton = false,
  hasCreateListButton = true,
  isLiked = false,
  onClickLike,
  onClickUnlike,
}: IFooterProps) => {
  const { toast } = useToast();
  const navigateTo = useStrictNavigateNext();
  const { withAuth } = useAuthWrapper();

  const handleCopyHref = () => {
    copyHref();
    toast({
      title: t`Copied to clipboard`,
      variant: 'success',
    });
  };

  const handleCreateList = withAuth(() => {
    navigateTo.createList();
  });

  const handleLike = withAuth(() => {
    if (isLiked) {
      onClickUnlike?.();
    } else {
      onClickLike?.();
    }
  });

  return (
    <footer
      id="floating-button-footer"
      className="w-w-mobile-max fixed inset-x-0 bottom-2 z-20 mx-auto flex items-end justify-between px-[26px] sm:sticky md:max-w-mobile-max"
    >
      <div className="flex flex-row gap-2">
        {hasLikeButton && (
          <Button
            onClick={handleLike}
            variant={ButtonVariant.WHITE}
            className="flex items-center gap-1.5 text-sm"
          >
            <IconLike
              className={cn(isLiked ? 'stroke-red-warning-01' : 'stroke-black')}
              fill={isLiked ? '#EB6052' : 'none'}
            />
            <Trans>Like</Trans>
          </Button>
        )}
        <Button
          onClick={handleCopyHref}
          variant={ButtonVariant.WHITE}
          className="flex items-center gap-1.5 text-sm"
        >
          <IconLink />
          <Trans>Copy</Trans>
        </Button>
      </div>
      {hasCreateListButton && (
        <Button
          variant={ButtonVariant.HIGHLIGHTED}
          shape={ButtonShape.ROUNDED_FULL}
          size={ButtonSize.ICON_LG}
          className="shadow-[0px_0px_20px_0px_#0000004D]"
          onClick={handleCreateList}
        >
          <IconAdd width={19} height={19} />
        </Button>
      )}
    </footer>
  );
};

export default FloatingButtonFooter;
