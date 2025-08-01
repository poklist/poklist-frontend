import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import IconAdd from '@/components/ui/icons/AddIcon';
import IconLike from '@/components/ui/icons/LikeIcon';
import IconLink from '@/components/ui/icons/LinkIcon';
import { MessageType } from '@/enums/Style/index.enum';
import { useAuthWrapper } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { cn, copyHref } from '@/lib/utils';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { DrawerIds } from '@/constants/Drawer';

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
  const { withAuth } = useAuthWrapper();
  const { openDrawer } = useDrawer(DrawerIds.CREATE_LIST_OR_IDEA_DRAWER_ID);

  const handleCopyHref = () => {
    copyHref();
    toast({
      title: t`Copied to clipboard`,
      variant: MessageType.SUCCESS,
    });
  };

  const handleCreateClick = withAuth(() => {
    openDrawer();
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
          onClick={handleCreateClick}
        >
          <IconAdd width={19} height={19} />
        </Button>
      )}
    </footer>
  );
};

export default FloatingButtonFooter;
