import { Button } from '@/components/ui/button';
import IconAdd from '@/components/ui/icons/AddIcon';
import IconLike from '@/components/ui/icons/LikeIcon';
import IconLink from '@/components/ui/icons/LinkIcon';
import useClipboard from '@/hooks/useClipboard';
import { cn } from '@/lib/utils';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface IFooterProps {
  // Add any props you need for the page
}

const FooterComponent: React.FC<IFooterProps> = () => {
  // May use ReactNode instead
  const [isShowLikeButton, _setIsShowLikeButton] = useState(true);
  const [liked, setLiked] = useState(false);

  const { copy } = useClipboard();
  const copyUrl = () => {
    copy(window.location.href);
  };
  return (
    <div className="fixed bottom-2 flex gap-2 justify-center items-center w-dvw">
      {isShowLikeButton && (
        <Button
          onClick={() => setLiked(!liked)}
          variant="white"
          className="flex items-center text-sm gap-1.5"
        >
          <IconLike
            className={cn(liked ? 'stroke-red-warning-01' : 'stroke-black')}
            fill={liked ? '#EB6052' : 'none'}
          />
          <Trans>喜愛</Trans>
        </Button>
      )}
      <Link to="/create">
        <Button variant="white" className="text-sm flex gap-2 items-center">
          <IconAdd />
          <Trans>建立名單</Trans>
        </Button>
      </Link>
      <Button
        onClick={() => copyUrl()}
        variant="white"
        className="text-sm flex gap-1.5 items-center"
      >
        <IconLink />
        <Trans>複製</Trans>
      </Button>
    </div>
  );
};

export default FooterComponent;
