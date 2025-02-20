import { Button, ButtonVariant } from '@/components/ui/button';
import IconAdd from '@/components/ui/icons/AddIcon';
import IconLike from '@/components/ui/icons/LikeIcon';
import IconLink from '@/components/ui/icons/LinkIcon';
import { cn, copyHref } from '@/lib/utils';
import useSocialStore from '@/stores/useSocialStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/macro';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface IFooterProps {
  hasLikeButton?: boolean;
  onUnmount?: () => void;
}

const FloatingButtonFooter: React.FC<IFooterProps> = ({
  hasLikeButton = false,
  onUnmount,
}) => {
  // May use ReactNode instead
  const navigate = useNavigate();
  const { user: me } = useUserStore();
  const { isLiked, setIsLiked } = useSocialStore();

  useEffect(() => {
    return () => {
      // NOTE: because if we use unmount hook of the parent component,
      // the like status can't be accessed.
      // so we need to call the onUnmount function.
      onUnmount?.();
    };
  }, [onUnmount]);

  return (
    <div className="fixed bottom-2 left-0 flex w-dvw items-center justify-center gap-2">
      {hasLikeButton && (
        <Button
          onClick={() => {
            setIsLiked(!isLiked);
          }}
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
        onClick={() => navigate(`/${me.userCode}/list/create`)}
      >
        <IconAdd />
        <Trans>Create List</Trans>
      </Button>
      <Button
        onClick={() => copyHref()}
        variant={ButtonVariant.WHITE}
        className="flex items-center gap-1.5 text-sm"
      >
        <IconLink />
        <Trans>Copy</Trans>
      </Button>
    </div>
  );
};

export default FloatingButtonFooter;
