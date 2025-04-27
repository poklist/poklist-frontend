import { DrawerComponent, useDrawer } from '@/components/Drawer';
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
import {
  SocialActionType,
  useSocialAction,
} from '@/hooks/mutations/useSocialAction';
import { useUser } from '@/hooks/queries/useUser';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import { useToast } from '@/hooks/useToast';
import {
  ensureProtocol,
  extractUsernameFromUrl,
  urlPreview,
} from '@/lib/utils';
import { UserRouteLayoutContextType } from '@/pages/Layout/UserRouteLayuout';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HeroSectionSkeleton } from './HeroSectionSkeleton';

const HeroSection: React.FC = () => {
  const { userCode } = useOutletContext<UserRouteLayoutContextType>();

  const navigateTo = useStrictNavigate();
  const { isLoggedIn } = useAuthStore();
  const { me, setMe } = useUserStore();
  const { openDrawer } = useDrawer();
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const { toast } = useToast();

  const isMyPage = userCode?.toString() === me.userCode.toString();
  const {
    data: currentUser,
    isLoading,
    isError,
  } = useUser({
    userCode,
  });

  useEffect(() => {
    if (isError) {
      // TODO: error handling 404 page
      navigateTo.error();
    }
  }, [isError, navigateTo]);

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

  useEffect(() => {
    setIsFollowing(isLoggedIn && currentUser?.isFollowing === true);
  }, [isLoggedIn, currentUser?.isFollowing]);

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

  if (isLoading || !currentUser) {
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
            <AvatarImage src={currentUser.profileImage} />
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
              onClick={() => navigateTo.editUser(me.userCode)}
            >
              <Trans>Edit profile and account</Trans>
            </Button>
          ) : isFollowing ? (
            <Button
              id="unfollow-button"
              variant={ButtonVariant.GRAY}
              size={ButtonSize.LG}
              onClick={() => unfollow({ params: { userID: currentUser.id } })}
            >
              <Trans>Following</Trans>
            </Button>
          ) : (
            <Button
              id="follow-button"
              variant={ButtonVariant.HIGHLIGHTED}
              size={ButtonSize.LG}
              onClick={() => follow({ params: { userID: currentUser.id } })}
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
            {currentUser.followerCount} <Trans>Followers</Trans>
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
