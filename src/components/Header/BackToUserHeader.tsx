import logoR from '@/assets/images/logo-r.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFollowAction } from '@/hooks/mutations/useFollowAction';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateAdapter';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import useAuthStore from '@/stores/useAuthStore';
import useFollowingStore from '@/stores/useFollowingStore';
import { User, UserPreview } from '@/types/User';
import { Trans } from '@lingui/react/macro';
import React, { useEffect } from 'react';
import { Button, ButtonShape, ButtonSize, ButtonVariant } from '../ui/button';

interface IBackToUserHeaderProps {
  owner?: UserPreview | User;
  hasFollowButton?: boolean;
}

const BackToUserHeader: React.FC<IBackToUserHeaderProps> = ({
  owner,
  hasFollowButton = false,
}) => {
  const { getIsFollowing, setIsFollowing, hasFollowingState } =
    useFollowingStore();
  const navigateTo = useStrictNavigationAdapter();
  const { isLoggedIn } = useAuthStore();
  const { withAuth } = useAuthWrapper();
  const { handleAuthRequired } = useAuthRequired();

  // 獲取當前用戶的關注狀態
  const isFollowing = owner ? getIsFollowing(owner.userCode) : false;

  // 如果 store 中沒有該用戶的狀態，且 owner 有 isFollowing 屬性，則初始化
  useEffect(() => {
    if (owner && 'isFollowing' in owner && !hasFollowingState(owner.userCode)) {
      const apiFollowingState = owner.isFollowing ?? false;
      setIsFollowing(owner.userCode, apiFollowingState);
    }
  }, [owner, hasFollowingState, setIsFollowing]);

  const { follow, unfollow } = useFollowAction({
    userCode: owner?.userCode || '',
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
    <>
      <header
        id="back-to-user-header"
        className="sticky top-0 z-50 box-border flex h-14 items-center border-b border-black-text-01 bg-white px-4"
      >
        <div
          id="header-left"
          className="flex w-[90px] min-w-[90px] items-center justify-start"
        >
          <img
            src={logoR.src}
            alt="P"
            onClick={handleClickLogo}
            className="h-8"
          />
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
                <AvatarImage src={owner?.profileImage || null} />
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
