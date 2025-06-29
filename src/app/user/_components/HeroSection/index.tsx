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
import { useUser } from '@/hooks/queries/useUser';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import { useToast } from '@/hooks/useToast';
import {
  ensureProtocol,
  extractUsernameFromUrl,
  urlPreview,
} from '@/lib/utils';

import useAuthStore from '@/stores/useAuthStore';
import useFollowingStore from '@/stores/useFollowingStore';
import useUserStore from '@/stores/useUserStore';
import { User } from '@/types/User';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';
import { HeroSectionSkeleton } from './HeroSectionSkeleton';

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
  const { toast } = useToast();

  // 獲取當前用戶的關注狀態
  const isFollowing = userCode ? getIsFollowing(userCode) : false;

  const { withAuth } = useAuthWrapper();

  const isMyPage = userCode?.toString() === me.userCode.toString();
  const {
    data: currentUser,
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

  // Add local followerCount state management (like ListCard likeCount)
  const [followerCount, setFollowerCount] = useState(0);
  const prevIsFollowingRef = useRef(isFollowing);

  useEffect(() => {
    if (isError) {
      // TODO: error handling 404 page
      if (isMyPage) {
        logout();
        navigateTo.discovery();
        toast({
          title: t`The login session is expired, please login again`,
          variant: 'success', // FUTURE: redefined variant
        });
      } else {
        navigateTo.error();
      }
    }
  }, [isError, isMyPage, logout, navigateTo, toast]);

  const { follow, unfollow } = useFollowAction({
    userCode: userCode || '',
    shouldAllow: () => isLoggedIn,
    onNotAllowed: handleAuthRequired,
  });

  const linkCount = useMemo(() => {
    if (currentUser?.socialLinks !== undefined) {
      return Object.keys(currentUser.socialLinks).length;
    } else {
      return 0;
    }
  }, [currentUser]);

  useEffect(() => {
    if (isMyPage && currentUser) {
      setMe({ ...currentUser });
    }
  }, [isMyPage, currentUser, setMe]);

  useLayoutEffect(() => {
    if (userCode && currentUser) {
      const apiFollowingState = isLoggedIn && currentUser.isFollowing === true;
      const hasExistingState = hasFollowingState(userCode);

      if (!hasExistingState) {
        // 只有當 store 中沒有該用戶的狀態時，才使用 API 資料初始化
        setIsFollowing(userCode, apiFollowingState);
      }
    }
  }, [isLoggedIn, currentUser, userCode, setIsFollowing, hasFollowingState]);

  // Update followerCount when currentUser.followerCount changes (from API refetch)
  useEffect(() => {
    if (currentUser?.followerCount !== undefined) {
      setFollowerCount(currentUser.followerCount);
    }
  }, [currentUser?.followerCount]);

  // Listen to isFollowing changes, only update followerCount when actual changes occur
  useEffect(() => {
    // Decrease followerCount when isFollowing changes from true to false
    if (prevIsFollowingRef.current === true && isFollowing === false) {
      setFollowerCount((prev) => prev - 1);
    }
    // Increase followerCount when isFollowing changes from false to true
    else if (prevIsFollowingRef.current === false && isFollowing === true) {
      setFollowerCount((prev) => prev + 1);
    }
    // Update prevIsFollowingRef for next comparison
    prevIsFollowingRef.current = isFollowing;
  }, [isFollowing]);

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
    setDrawerContent(<p>{currentUser?.bio}</p>);
    openDrawer(DrawerIds.USER_HERO_SECTION_DRAWER_ID);
  };

  const onOpenLinkDrawer = () => {
    if (currentUser?.socialLinks === undefined) {
      return;
    }
    const socialLinkTypeList = Object.entries(currentUser.socialLinks) as [
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
    if (currentUser) {
      follow({ params: { userID: currentUser.id } });
    }
  });

  const handleUnfollow = withAuth(() => {
    if (currentUser) {
      unfollow({ params: { userID: currentUser.id } });
    }
  });

  // Check if data is loaded
  const isDataLoaded = !isLoading && currentUser !== undefined;

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
            <AvatarImage src={currentUser.profileImage || undefined} />
            <AvatarFallback>{currentUser.displayName[0]}</AvatarFallback>
          </Avatar>
          <p className="text-[17px] font-bold">{currentUser.displayName}</p>
          <p className="text-[13px] font-semibold">@{currentUser.userCode}</p>
          {currentUser.bio && (
            <p
              ref={bioRef}
              className="line-clamp-1 max-w-[350px] text-[13px] font-normal"
              onClick={onOpenBioDrawer}
            >
              {currentUser.bio}
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
          ) : isFollowing ? (
            <Button
              id="unfollow-button"
              variant={ButtonVariant.GRAY}
              size={ButtonSize.LG}
              onClick={handleUnfollow}
            >
              <Trans>Following</Trans>
            </Button>
          ) : (
            <Button
              id="follow-button"
              variant={ButtonVariant.HIGHLIGHTED}
              size={ButtonSize.LG}
              onClick={handleFollow}
            >
              <Trans>Follow</Trans>
            </Button>
          )}
        </div>
        <div id="hero-stats" className="flex gap-2">
          <p>
            {currentUser.listCount} <Trans>Lists</Trans>
          </p>
          <p>
            {followerCount} <Trans>Followers</Trans>
          </p>
          <p>
            {currentUser.followingCount} <Trans>Following</Trans>
          </p>
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
