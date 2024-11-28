import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useIsMyPage from '@/hooks/useIsMyPage';
import axios from '@/lib/axios';
import useUserStore from '@/stores/useUserStore';
import { User } from '@/types/User';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface IHeroSectionProps {
  viewUser: User;
}

export const HeroSection: React.FC<IHeroSectionProps> = ({ viewUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();
  const isMyPage = useIsMyPage(id);

  const linkCount = useMemo(() => {
    if (viewUser.socialLinks !== undefined) {
      return Object.keys(viewUser.socialLinks).length;
    } else {
      return 0;
    }
  }, [viewUser]);

  const [isFollowing, setIsFollowing] = useState(false);

  const follow = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    axios
      .post('/follow', null, { params: { userID: viewUser.id } })
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
      .post('/unfollow', null, { params: { userID: viewUser.id } })
      .then(() => {
        // TODO: success message
        setIsFollowing(false);
      })
      .catch(() => {
        // TODO: error message
      });
  };

  const goToEditPage = () => {
    navigate('/user/edit');
  };

  useEffect(() => {
    // TODO: triggered multiple times but reason is not realized yet
    setIsFollowing(isLoggedIn && viewUser.isFollowing === true);
    console.log('isFollowing:', isFollowing);
  }, [viewUser]);

  return (
    <div role="hero" className="flex flex-col items-center gap-4 pb-4 pt-6">
      <div id="hero-basic-info" className="flex flex-col items-center gap-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={viewUser.profileImage} />
          <AvatarFallback>{viewUser.displayName[0]}</AvatarFallback>
        </Avatar>
        <p className="text-[17px] font-bold">{viewUser.displayName}</p>
        <p className="text-[13px] font-semibold">@{viewUser.userCode}</p>
        <p className="text-[13px] font-normal">
          {viewUser.bio /* TODO: trimTail */}
        </p>
      </div>
      <div id="action-button">
        {isMyPage ? (
          <Button
            id="edit-profile-button"
            variant="black"
            size="lg"
            onClick={goToEditPage}
            className="rounded-lg"
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
        <p>{viewUser.listCount} Lists</p>
        <p>{viewUser.followerCount} Followers</p>
        <p>{viewUser.followingCount} Following</p>
        <p>{linkCount} Links</p>
      </div>
    </div>
  );
};
