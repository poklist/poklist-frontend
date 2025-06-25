import { Button, ButtonVariant } from '@/components/ui/button';
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
      className="fixed inset-x-0 bottom-2 z-20 mx-auto flex w-fit items-center justify-center gap-2 sm:sticky md:max-w-mobile-max"
    >
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
      {hasCreateListButton && (
        <Button
          variant={ButtonVariant.WHITE}
          className="flex items-center gap-2 text-sm"
          onClick={handleCreateList}
        >
          <IconAdd />
          <Trans>Create List</Trans>
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
    </footer>
  );
};

export default FloatingButtonFooter;
