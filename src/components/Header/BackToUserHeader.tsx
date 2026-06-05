import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { useFollowAction } from '@/hooks/mutations/useFollowAction';
import { useAuthWrapper } from '@/hooks/useAuth';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import useAuthStore from '@/stores/useAuthStore';
import useFollowingStore from '@/stores/useFollowingStore';
import { User, UserPreview } from '@/types/User';
import { Trans } from '@lingui/macro';
import { Skeleton } from '@radix-ui/themes';
import Image from 'next/image';
import React, { useEffect } from 'react';

interface IBackToUserHeaderProps {
  owner?: UserPreview | User;
  hasFollowButton?: boolean;
}

const BackToUserHeader: React.FC<IBackToUserHeaderProps> = ({
  owner,
  hasFollowButton = false,
}) => {
  const {
    getIsFollowing,
    setIsFollowing,
    hasFollowingState,
    setConfirmedIsFollowing,
    hasConfirmedFollowingState,
  } = useFollowingStore();
  const navigateTo = useStrictNavigateNext();
  const { isLoggedIn } = useAuthStore();
  const { withAuth } = useAuthWrapper();
  const { handleAuthRequired } = useAuthRequired();

  // 獲取當前用戶的 Following status
  const isFollowing = owner ? getIsFollowing(owner.userCode) : false;

  useEffect(() => {
    if (owner && 'isFollowing' in owner) {
      const apiFollowingState = owner.isFollowing ?? false;
      if (!hasFollowingState(owner.userCode)) {
        setIsFollowing(owner.userCode, apiFollowingState);
      }
      setConfirmedIsFollowing(owner.userCode, apiFollowingState);
    }
  }, [owner, hasFollowingState, setIsFollowing, setConfirmedIsFollowing]);

  const { follow, unfollow } = useFollowAction({
    currentUserCode: owner?.userCode || '',
    currentUserID: owner?.id || -1,
    shouldAllow: () => isLoggedIn,
    onNotAllowed: handleAuthRequired,
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
    <header
      id="back-to-user-header"
      className="sticky top-0 z-50 box-border flex h-14 items-center border-b border-black-text-01 bg-white px-4"
    >
      <div
        id="header-left"
        className="flex w-[90px] min-w-[90px] items-center justify-start"
      >
        <Image
          src="/images/logo/logo-r.svg"
          alt="Relist logo"
          width={32}
          height={32}
          priority
          onClick={handleClickLogo}
        />
      </div>
      <div
        id="header-middle"
        className="flex flex-grow items-center justify-center"
      >
        {owner ? (
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={handleClickBackToUser}
          >
            <Avatar className="ml-1 h-6 w-6">
              <AvatarImage src={owner?.profileImage || undefined} />
              <AvatarFallback>{owner?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <p className="font-regular ml-2 line-clamp-1 text-[15px]">
              {owner?.displayName}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="ml-1 h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        )}
      </div>
      <div
        id="header-right"
        className="flex w-[90px] min-w-[90px] items-center justify-end"
      >
        {hasFollowButton &&
          (hasConfirmedFollowingState(owner?.userCode ?? '') ? (
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
          ) : (
            <Skeleton className="h-8 w-20 rounded-full" />
          ))}
      </div>
    </header>
  );
};

export default BackToUserHeader;
