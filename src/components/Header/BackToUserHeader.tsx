import headerP from '@/assets/images/header-p.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import IconLeftArrow from '@/components/ui/icons/LeftArrowIcon';
import { IListOwnerInfo } from '@/hooks/Lists/useGetList';
import useRelationStore from '@/stores/useRelationStore';
import { Trans } from '@lingui/macro';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { User } from '@/types/User';

interface IBackToUserHeaderProps {
  owner?: IListOwnerInfo | User;
  hasFollowButton?: boolean;
  onUnmount?: () => void;
}

const BackToUserHeader: React.FC<IBackToUserHeaderProps> = ({
  owner,
  hasFollowButton = false,
  onUnmount,
}) => {
  const navigate = useNavigate();
  const { isFollowing, setIsFollowing } = useRelationStore();

  useEffect(() => {
    return () => {
      onUnmount?.();
    };
  }, [onUnmount]);

  const onClickBackToUser = () => {
    if (owner) {
      navigate(`/${owner.userCode}`);
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-black-text-01 p-3">
      <div id="header-left" className="flex items-center justify-center gap-1">
        <img src={headerP} alt="P" />
        <div
          className="flex items-center justify-center"
          onClick={onClickBackToUser}
        >
          <span className="flex h-5 w-5 items-center justify-center">
            <IconLeftArrow />
          </span>
          <Avatar className="ml-1 h-6 w-6">
            <AvatarImage src={owner?.profileImage} />
            <AvatarFallback>{owner?.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <p className="font-regular ml-2 text-[15px]">{owner?.displayName}</p>
        </div>
      </div>
      {hasFollowButton && (
        <Button
          variant={isFollowing ? 'subActive' : 'black'}
          shape="roundedFull"
          size="sm"
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? <Trans>Following</Trans> : <Trans>Follow</Trans>}
        </Button>
      )}
    </header>
  );
};

export default BackToUserHeader;
