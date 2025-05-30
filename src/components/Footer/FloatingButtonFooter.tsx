import { Button, ButtonVariant } from '@/components/ui/button';
import IconAdd from '@/components/ui/icons/AddIcon';
import IconLike from '@/components/ui/icons/LikeIcon';
import IconLink from '@/components/ui/icons/LinkIcon';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigation from '@/hooks/useStrictNavigate';
import { useToast } from '@/hooks/useToast';
import { cn, copyHref } from '@/lib/utils';
import useSocialStore from '@/stores/useSocialStore';
import useUserStore from '@/stores/useUserStore';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';

interface IFooterProps {
  hasLikeButton?: boolean;
  isLiked?: boolean;
  onClickLike?: () => void;
  onClickUnlike?: () => void;
}

const FloatingButtonFooter: React.FC<IFooterProps> = ({
  hasLikeButton = false,
  isLiked: externalIsLiked,
  onClickLike,
  onClickUnlike,
}) => {
  const { toast } = useToast();
  const { me } = useUserStore();
  const { isLiked: storeIsLiked } = useSocialStore();
  const navigateTo = useStrictNavigation();
  const { withAuth } = useAuthWrapper();

  const isLiked =
    externalIsLiked !== undefined ? externalIsLiked : storeIsLiked;

  const handleCopyHref = () => {
    copyHref();
    toast({
      title: t`Copied to clipboard`,
      variant: 'success',
    });
  };

  const handleCreateList = withAuth(() => {
    navigateTo.createList(me.userCode);
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
      className="fixed inset-x-0 bottom-2 mx-auto flex w-fit items-center justify-center gap-2 sm:sticky md:max-w-mobile-max"
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
      <Button
        variant={ButtonVariant.WHITE}
        className="flex items-center gap-2 text-sm"
        onClick={handleCreateList}
      >
        <IconAdd />
        <Trans>Create List</Trans>
      </Button>
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
