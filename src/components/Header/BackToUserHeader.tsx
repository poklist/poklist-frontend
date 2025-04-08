import headerP from '@/assets/images/header-p.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import IconLeftArrow from '@/components/ui/icons/LeftArrowIcon';
import { IListOwnerInfo } from '@/hooks/Lists/useGetList';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import useRelationStore from '@/stores/useRelationStore';
import { User } from '@/types/User';
import { Trans } from '@lingui/react/macro';
import React from 'react';
import { Button, ButtonShape, ButtonSize, ButtonVariant } from '../ui/button';

interface IBackToUserHeaderProps {
  owner?: IListOwnerInfo | User;
  hasFollowButton?: boolean;
  onClickFollow?: () => void;
  onClickUnfollow?: () => void;
}

const BackToUserHeader: React.FC<IBackToUserHeaderProps> = ({
  owner,
  hasFollowButton = false,
  onClickFollow,
  onClickUnfollow,
}) => {
  const { isFollowing } = useRelationStore();
  const navigateTo = useStrictNavigate();
  const onClickBackToUser = () => {
    if (owner) {
      navigateTo.user(owner.userCode);
    }
  };

  const onClickLogo = () => {
    navigateTo.home();
  };

  return (
    <>
      <header
        id="back-to-user-header"
        className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-black-text-01 bg-white p-3"
      >
        <div
          id="header-left"
          className="flex items-center justify-center gap-1"
        >
          <img src={headerP} alt="P" onClick={onClickLogo} />
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
            <p className="font-regular ml-2 text-[15px]">
              {owner?.displayName}
            </p>
          </div>
        </div>
        {hasFollowButton && (
          <Button
            variant={
              isFollowing ? ButtonVariant.SUB_ACTIVE : ButtonVariant.BLACK
            }
            shape={ButtonShape.ROUNDED_FULL}
            size={ButtonSize.SM}
            onClick={() => {
              if (isFollowing) {
                onClickUnfollow?.();
              } else {
                onClickFollow?.();
              }
            }}
          >
            {isFollowing ? <Trans>Following</Trans> : <Trans>Follow</Trans>}
          </Button>
        )}
      </header>
      {/* <div className="h-14 sm:hidden" /> */}
    </>
  );
};

export default BackToUserHeader;
