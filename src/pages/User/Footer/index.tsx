import { Button } from '@/components/ui/button';
import IconAdd from '@/components/ui/icons/AddIcon';
import IconLike from '@/components/ui/icons/LikeIcon';
import IconLink from '@/components/ui/icons/LinkIcon';
import useClipboard from '@/hooks/useClipboard';
import { cn } from '@/lib/utils';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface IFooterProps {
  // Add any props you need for the page
}

const FooterComponent: React.FC<IFooterProps> = () => {
  // May use ReactNode instead
  const location = useLocation();
  const isShowLikeButton = location.pathname.startsWith('/list/');
  const [liked, setLiked] = useState(false);

  const { copy } = useClipboard();
  const copyUrl = () => {
    copy(window.location.href);
  };
  return (
    <div className="fixed bottom-2 flex w-dvw items-center justify-center gap-2">
      {isShowLikeButton && (
        <Button
          onClick={() => setLiked(!liked)}
          variant="white"
          className="flex items-center gap-1.5 text-sm"
        >
          <IconLike
            className={cn(liked ? 'stroke-red-warning-01' : 'stroke-black')}
            fill={liked ? '#EB6052' : 'none'}
          />
          {liked ? <Trans>Liked</Trans> : <Trans>Like</Trans>}
        </Button>
      )}
      <Link to="/list/create">
        <Button variant="white" className="flex items-center gap-2 text-sm">
          <IconAdd />
          <Trans>Create List</Trans>
        </Button>
      </Link>
      <Button
        onClick={() => copyUrl()}
        variant="white"
        className="flex items-center gap-1.5 text-sm"
      >
        <IconLink />
        <Trans>Copy</Trans>
      </Button>
    </div>
  );
};

export default FooterComponent;
