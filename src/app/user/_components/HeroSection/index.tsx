import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { DrawerIds } from '@/constants/Drawer';
import { SocialLinkType } from '@/enums/index.enum';
import { useFollowAction } from '@/hooks/mutations/useFollowAction';
import useFollowers from '@/hooks/queries/useFollowers';
import useFollowings from '@/hooks/queries/useFollowings';
import { useUser } from '@/hooks/queries/useUser';
import { useAuthWrapper } from '@/hooks/useAuth';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import {
  ensureProtocol,
  extractUsernameFromUrl,
  urlPreview,
} from '@/lib/utils';

import FollowersListDrawer from '@/app/user/_components/HeroSection/FollowersListDrawer';

import useAuthStore from '@/stores/useAuthStore';
import useFollowingStore from '@/stores/useFollowingStore';
import useUserStore from '@/stores/useUserStore';
import { User } from '@/types/User';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import FollowingListDrawer from '@/app/user/_components/HeroSection/FollowingListDrawer';
import { HeroSectionSkeleton } from '@/app/user/_components/HeroSection/HeroSectionSkeleton';
import { MessageType } from '@/enums/Style/index.enum';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';

const HeroSection: React.FC = () => {
  const { userCode } = useUserRouteContext();

  const navigateTo = useStrictNavigationAdapter();
  const { isLoggedIn, logout } = useAuthStore();
  const { me, setMe } = useUserStore();
  const { getIsFollowing, setIsFollowing, hasFollowingState } =
    useFollowingStore();
  const { openDrawer } = useDrawer();
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const { handleAuthRequired } = useAuthRequired();

  // 獲取當前用戶的關注狀態
  const isFollowing = userCode ? getIsFollowing(userCode) : false;

  const { withAuth } = useAuthWrapper();

  const isMyPage = userCode?.toString() === me.userCode.toString();
  const {
    data: currentPageUser,
    isLoading,
    isError,
  } = useUser({
    userCode,
    onError: (error) => {
      console.error(error);
      navigateTo.home();
    },
  }) as {
    data: User | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const { data: followersList, isLoading: isFollowerLoading } = useFollowers({
    userID: currentPageUser?.id,
    onError: (error) => console.error(error),
  });

  const { data: followingList, isLoading: isFollowingLoading } = useFollowings({
    userID: currentPageUser?.id,
    onError: (error) => console.error(error),
  });

  useEffect(() => {
    if (isError) {
      // TODO: error handling 404 page
      if (isMyPage) {
        logout();
        navigateTo.discovery();
        toast({
          title: t`The login session is expired, please login again`,
          variant: MessageType.ERROR,
        });
      } else {
        navigateTo.error();
      }
    }
  }, [isError, isMyPage, logout, navigateTo, toast]);

  const {
    follow,
    unfollow,
    isPending: isFollowPending,
  } = useFollowAction({
    currentUserCode: currentPageUser?.userCode || '',
    currentUserID: currentPageUser?.id || -1,
    shouldAllow: () => isLoggedIn,
    onNotAllowed: handleAuthRequired,
  });

  const linkCount = useMemo(() => {
    if (currentPageUser?.socialLinks !== undefined) {
      return Object.keys(currentPageUser.socialLinks).length;
    } else {
      return 0;
    }
  }, [currentPageUser]);

  useEffect(() => {
    if (isMyPage && currentPageUser) {
      setMe({ ...currentPageUser });
    }
  }, [isMyPage, currentPageUser, setMe]);

  useLayoutEffect(() => {
    if (userCode && currentPageUser) {
      const apiFollowingState =
        isLoggedIn && currentPageUser.isFollowing === true;
      const hasExistingState = hasFollowingState(userCode);

      if (!hasExistingState) {
        // 只有當 store 中沒有該用戶的狀態時，才使用 API 資料初始化
        setIsFollowing(userCode, apiFollowingState);
      }
    }
  }, [
    isLoggedIn,
    currentPageUser,
    userCode,
    setIsFollowing,
    hasFollowingState,
  ]);

  // FUTURE: refactor the drawer content because we may have more than one drawer
  const onOpenBioDrawer = () => {
    // FUTURE: extract this logic to a separate hook/utility function
    if (
      bioRef.current?.scrollHeight === undefined ||
      bioRef.current?.clientHeight === undefined ||
      bioRef.current.scrollHeight <= bioRef.current.clientHeight
    ) {
      return;
    }
    setDrawerContent(<p>{currentPageUser?.bio}</p>);
    openDrawer(DrawerIds.USER_HERO_SECTION_DRAWER_ID);
  };

  const onOpenLinkDrawer = () => {
    if (currentPageUser?.socialLinks === undefined) {
      return;
    }
    const socialLinkTypeList = Object.entries(currentPageUser.socialLinks) as [
      SocialLinkType,
      string,
    ][];
    setDrawerContent(
      <div className="flex flex-col gap-4">
        {socialLinkTypeList.map(
          ([linkType, link]: [SocialLinkType, string]) => {
            return (
              <div
                key={linkType}
                className="flex h-8 cursor-pointer items-center gap-2 px-2 text-[13px]"
              >
                <LinkIconWrapper variant={linkType} />
                <a
                  className="text-black-text-01"
                  href={ensureProtocol(link)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkType === SocialLinkType.CUSTOMIZED
                    ? urlPreview(link)
                    : extractUsernameFromUrl(linkType, link)}
                </a>
              </div>
            );
          }
        )}
      </div>
    );
    openDrawer(DrawerIds.USER_HERO_SECTION_DRAWER_ID);
  };

  const handleFollow = withAuth(() => {
    if (currentPageUser) {
      follow({ params: { userID: currentPageUser.id } });
    }
  });

  const handleUnfollow = withAuth(() => {
    if (currentPageUser) {
      unfollow({ params: { userID: currentPageUser.id } });
    }
  });

  // Check if data is loaded
  const isDataLoaded =
    !isLoading &&
    currentPageUser !== undefined &&
    !isFollowerLoading &&
    !isFollowingLoading;

  if (!isDataLoaded) {
    return <HeroSectionSkeleton />;
  }

  return (
    <>
      <div
        role="hero"
        className="flex flex-col items-center gap-4 border-b border-black bg-white pb-4 pt-6"
      >
        <div id="hero-basic-info" className="flex flex-col items-center gap-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={currentPageUser.profileImage || undefined} />
            <AvatarFallback>{currentPageUser.displayName[0]}</AvatarFallback>
          </Avatar>
          <p className="text-[17px] font-bold">{currentPageUser.displayName}</p>
          <p className="text-[13px] font-semibold">
            @{currentPageUser.userCode}
          </p>
          {currentPageUser.bio && (
            <p
              ref={bioRef}
              className="line-clamp-1 max-w-[350px] text-[13px] font-normal"
              onClick={onOpenBioDrawer}
            >
              {currentPageUser.bio}
            </p>
          )}
        </div>
        <div id="action-button">
          {isMyPage ? (
            <Button
              id="edit-profile-button"
              variant={ButtonVariant.BLACK}
              size={ButtonSize.LG}
              shape={ButtonShape.ROUNDED_5PX}
              onClick={() => navigateTo.editUser()}
            >
              <Trans>Edit profile and account</Trans>
            </Button>
          ) : (
            <Button
              id={isFollowing ? 'unfollow-button' : 'follow-button'}
              variant={isFollowing ? ButtonVariant.GRAY : ButtonVariant.BLACK}
              size={ButtonSize.LG}
              disabled={isFollowPending}
              onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              {isFollowing ? <Trans>Following</Trans> : <Trans>Follow</Trans>}
            </Button>
          )}
        </div>
        <div id="hero-stats" className="flex gap-2">
          <p>
            {currentPageUser.listCount} <Trans>Lists</Trans>
          </p>
          <FollowersListDrawer followersList={followersList} />
          <FollowingListDrawer followingList={followingList} />
          <p
            className="cursor-pointer font-semibold"
            onClick={onOpenLinkDrawer}
          >
            {linkCount} <Trans context="count">Links</Trans>
          </p>
        </div>
      </div>
      <DrawerComponent
        drawerId={DrawerIds.USER_HERO_SECTION_DRAWER_ID}
        isShowClose={false}
        header={<></>}
        subHeader={<></>}
        content={drawerContent}
        footer={<></>}
      />
    </>
  );
};

export default HeroSection;
