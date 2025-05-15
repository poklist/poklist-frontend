import logoR from '@/assets/images/logo-r.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import useAuthStore from '@/stores/useAuthStore';
import useCommonStore from '@/stores/useCommonStore';
import useRelationStore from '@/stores/useRelationStore';
import { User, UserPreview } from '@/types/User';
import { Trans } from '@lingui/react/macro';
import React from 'react';
import { Button, ButtonShape, ButtonSize, ButtonVariant } from '../ui/button';
import { useUIStore } from '@/stores/useUIStore';

interface IBackToUserHeaderProps {
  owner?: UserPreview | User;
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
  const { setIsLoginDrawerOpen } = useCommonStore();
  const { isLoggedIn } = useAuthStore();
  const { scrollToTop } = useUIStore();

  const handleClickBackToUser = () => {
    if (owner) {
      navigateTo.user(owner.userCode);
    }
  };

  const handleClickLogo = () => {
    scrollToTop();
    navigateTo.discovery();
  };

  const handleFollow = () => {
    if (!isLoggedIn) {
      setIsLoginDrawerOpen(true);
      return;
    }
    if (isFollowing) {
      onClickUnfollow?.();
    } else {
      onClickFollow?.();
    }
  };

  return (
    <>
      <header
        id="back-to-user-header"
        className="sticky top-0 z-50 box-border flex h-14 items-center border-b border-black-text-01 bg-white px-4"
      >
        <div
          id="header-left"
          className="flex w-[90px] min-w-[90px] items-center justify-start"
        >
          <img src={logoR} alt="P" onClick={handleClickLogo} className="h-8" />
        </div>
        <div
          id="header-middle"
          className="flex flex-grow items-center justify-center"
        >
          {owner && (
            <div
              className="flex cursor-pointer items-center justify-center"
              onClick={handleClickBackToUser}
            >
              <Avatar className="ml-1 h-6 w-6">
                <AvatarImage src={owner?.profileImage} />
                <AvatarFallback>{owner?.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <p className="font-regular ml-2 line-clamp-1 text-[15px]">
                {owner?.displayName}
              </p>
            </div>
          )}
        </div>
        <div
          id="header-right"
          className="flex w-[90px] min-w-[90px] items-center justify-end"
        >
          {hasFollowButton && (
            <Button
              variant={
                isFollowing ? ButtonVariant.SUB_ACTIVE : ButtonVariant.BLACK
              }
              shape={ButtonShape.ROUNDED_FULL}
              size={ButtonSize.SM}
              onClick={handleFollow}
            >
              {isFollowing ? <Trans>Following</Trans> : <Trans>Follow</Trans>}
            </Button>
          )}
        </div>
      </header>
    </>
  );
};

export default BackToUserHeader;
