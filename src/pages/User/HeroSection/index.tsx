import { DrawerComponent, useDrawer } from '@/components/Drawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { SocialLinkType } from '@/enums/index.enum';
import axios from '@/lib/axios';
import {
  extractUsernameFromUrl,
  getPreviewText,
  urlPreview,
} from '@/lib/utils';
import useUserStore from '@/stores/useUserStore';
import { IResponse } from '@/types/response';
import { User } from '@/types/User';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HeroSectionSkeleton } from './HeroSectionSkeleton';

const HeroSection: React.FC = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const {
    isLoggedIn,
    user: me,
    setUser,
    currentUser,
    setCurrentUser,
  } = useUserStore();
  const { openDrawer } = useDrawer();
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const linkCount = useMemo(() => {
    if (currentUser.socialLinks !== undefined) {
      return Object.keys(currentUser.socialLinks).length;
    } else {
      return 0;
    }
  }, [currentUser]);

  const isMyPage = code?.toString() === me.userCode.toString();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsFollowing(isLoggedIn && currentUser.isFollowing === true);
  }, [isLoggedIn, currentUser.isFollowing]);

  const follow = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    // FUTURE: refactor the follow/unfollow API
    axios
      .post('/follow', null, { params: { userID: currentUser.id } })
      .then(() => {
        // TODO: success message
        setIsFollowing(true);
      })
      .catch(() => {
        // TODO: error message
      });
  };

  const unfollow = () => {
    axios
      .post('/unfollow', null, { params: { userID: currentUser.id } })
      .then(() => {
        // TODO: success message
        setIsFollowing(false);
      })
      .catch(() => {
        // TODO: error message
      });
  };

  const goToEditPage = () => {
    navigate('/account/edit');
  };

  const getUser = async (code: string) => {
    if (!code) return;
    const res = await axios.get<IResponse<User>>(`/${code}/info`);
    if (!res.data.content) {
      throw new Error('No user data');
    }
    setCurrentUser({ ...res.data.content }); // deep copy
    if (res.data.content?.id === me.id) {
      setUser(res.data.content);
    }
    setIsLoading(false);
  };

  // FUTURE: refactor the drawer content because we may have more than one drawer
  const onOpenBioDrawer = () => {
    setDrawerContent(<p>{currentUser.bio}</p>);
    openDrawer();
  };

  const onOpenLinkDrawer = () => {
    if (currentUser.socialLinks === undefined) {
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
                  href={link}
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
    openDrawer();
  };

  useEffect(() => {
    if (code !== undefined) {
      getUser(code);
    }
  }, [code]);

  if (isLoading) {
    return <HeroSectionSkeleton />;
  }
  return (
    <>
      <div
        role="hero"
        className="flex flex-col items-center gap-4 border-b border-black pb-4 pt-6"
      >
        <div id="hero-basic-info" className="flex flex-col items-center gap-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={currentUser.profileImage} />
            <AvatarFallback>{currentUser.displayName[0]}</AvatarFallback>
          </Avatar>
          <p className="text-[17px] font-bold">{currentUser.displayName}</p>
          <p className="text-[13px] font-semibold">@{currentUser.userCode}</p>
          {currentUser.bio && (
            <p className="text-[13px] font-normal" onClick={onOpenBioDrawer}>
              {getPreviewText(currentUser.bio, 20)}
            </p>
          )}
        </div>
        <div id="action-button">
          {isMyPage ? (
            <Button
              id="edit-profile-button"
              variant="black"
              size="lg"
              shape="rounded8px"
              onClick={goToEditPage}
            >
              Edit profile and account
            </Button>
          ) : isFollowing ? (
            <Button
              id="unfollow-button"
              variant="gray"
              size="lg"
              onClick={unfollow}
            >
              Following
            </Button>
          ) : (
            <Button
              id="follow-button"
              variant="highlighted"
              size="lg"
              onClick={follow}
            >
              Follow
            </Button>
          )}
        </div>
        <div id="hero-stats" className="flex gap-2">
          <p>{currentUser.listCount} Lists</p>
          <p>{currentUser.followerCount} Followers</p>
          <p>{currentUser.followingCount} Following</p>
          <p
            className="cursor-pointer font-semibold"
            onClick={onOpenLinkDrawer}
          >
            {linkCount} Links
          </p>
        </div>
      </div>
      <DrawerComponent
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
