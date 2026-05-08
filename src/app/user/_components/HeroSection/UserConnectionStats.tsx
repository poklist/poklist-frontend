import { useGetFollowers } from '@/hooks/api/followers/useGetFollowers';
import { useGetFollowings } from '@/hooks/api/followings/useGetFollowings';
import FollowersListDrawer from './FollowersListDrawer';
import FollowingListDrawer from './FollowingListDrawer';

const UserConnectionStats = ({ userID }: { userID: number }) => {
  const {
    data: followersData,
    isError: isFollowersError,
    error: followersError,
  } = useGetFollowers({
    userID,
  });

  if (isFollowersError) {
    console.error(followersError);
  }

  const {
    data: followingData,
    isError: isFollowingsError,
    error: followingsError,
  } = useGetFollowings({
    userID,
  });

  if (isFollowingsError) {
    console.error(followingsError);
  }

  return (
    <>
      <FollowersListDrawer followersList={followersData} />
      <FollowingListDrawer followingList={followingData} />
    </>
  );
};

export default UserConnectionStats;
