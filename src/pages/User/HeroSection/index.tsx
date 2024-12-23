import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import useUserStore from '@/stores/useUserStore';
import { User } from '@/types/User';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HeroSectionSkeleton } from './HeroSectionSkeleton';

const HeroSection: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    isLoggedIn,
    user: me,
    setUser,
    currentUser,
    setCurrentUser,
  } = useUserStore();
  // const [viewUser, setViewUser] = useState<User>(emptyUser);

  const linkCount = useMemo(() => {
    if (currentUser.socialLinks !== undefined) {
      return Object.keys(currentUser.socialLinks).length;
    } else {
      return 0;
    }
  }, [currentUser]);

  const isMyPage = id?.toString() === me.id.toString();
  let isFollowing = isLoggedIn && currentUser.isFollowing === true;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const follow = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    axios
      .post('/follow', null, { params: { userID: currentUser.id } })
      .then(() => {
        // TODO: success message
        isFollowing = true;
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
        isFollowing = false;
      })
      .catch(() => {
        // TODO: error message
      });
  };

  const goToEditPage = () => {
    navigate('/user/edit');
  };

  const getUser = async (id: string) => {
    axios.get<User>(`/users/${id}`).then((res) => {
      setCurrentUser({ ...res.data }); // deep copy
      if (res.data.id === me.id) {
        setUser(res.data);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (id != undefined) {
      getUser(id);
    }
  }, [id]);

  if (isLoading) {
    return <HeroSectionSkeleton />;
  }
  return (
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
        <p className="text-[13px] font-normal">
          {currentUser.bio /* TODO: trimTail */}
        </p>
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
        <p>{linkCount} Links</p>
      </div>
    </div>
  );
};

export default HeroSection;
