import logoR from '@/assets/images/logo-r.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SocialActionType,
  useSocialAction,
} from '@/hooks/mutations/useSocialAction';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigation from '@/hooks/useStrictNavigate';
import { toast } from '@/hooks/useToast';
import useAuthStore from '@/stores/useAuthStore';
import useRelationStore from '@/stores/useRelationStore';
import { User, UserPreview } from '@/types/User';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import React from 'react';
import { Button, ButtonShape, ButtonSize, ButtonVariant } from '../ui/button';

interface IBackToUserHeaderProps {
  owner?: UserPreview | User;
  hasFollowButton?: boolean;
}

const BackToUserHeader: React.FC<IBackToUserHeaderProps> = ({
  owner,
  hasFollowButton = false,
}) => {
  const { isFollowing, setIsFollowing } = useRelationStore();
  const navigateTo = useStrictNavigation();
  const { isLoggedIn } = useAuthStore();
  const { withAuth } = useAuthWrapper();

  const { debouncedMutate: follow } = useSocialAction({
    actionKey: 'follow',
    debounceGroupKey: SocialActionType.FOLLOW,
    url: '/follow',
    shouldAllow: () => isLoggedIn,
    onNotAllowed: () => {
      toast({
        title: t`Please login to do this action`,
        variant: 'destructive',
      });
    },
    onOptimisticUpdate: () => {
      setIsFollowing(true);
    },
  });
  const { debouncedMutate: unfollow } = useSocialAction({
    actionKey: 'unfollow',
    debounceGroupKey: SocialActionType.FOLLOW,
    url: '/unfollow',
    shouldAllow: () => isLoggedIn,
    onNotAllowed: () => {
      toast({
        title: t`Please login to do this action`,
        variant: 'destructive',
      });
    },
    onOptimisticUpdate: () => {
      setIsFollowing(false);
    },
  });

  const handleClickBackToUser = () => {
    if (owner) {
      navigateTo.user(owner.userCode);
    }
  };

  const handleClickLogo = () => {
    // 清除 discovery 頁面的滾動位置紀錄
    sessionStorage.removeItem('scroll_pos_/discovery');
    navigateTo.discovery();
  };

  const handleFollowOrUnfollow = withAuth(() => {
    if (!owner) {
      return;
    }
    if (isFollowing) {
      unfollow({ params: { userID: owner.id } });
    } else {
      follow({ params: { userID: owner.id } });
    }
  });

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
              onClick={handleFollowOrUnfollow}
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
