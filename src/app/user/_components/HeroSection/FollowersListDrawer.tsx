import { GetFollowersResponse } from '@/api/query/followers';
import FollowRelationsDrawer from '@/app/user/_components/FollowRelationsDrawer';
import UserConnectionRow from '@/app/user/_components/UserConnectionRow';
import { t, Trans } from '@lingui/macro';

export interface FollowersListDrawerProps {
  followersList: GetFollowersResponse['content'] | undefined;
}

const FollowersListDrawer = ({ followersList }: FollowersListDrawerProps) => {
  return (
    <FollowRelationsDrawer
      drawerTrigger={
        <>
          {followersList?.length || '0'} <Trans>粉絲</Trans>
        </>
      }
      headerTitle={`${followersList?.length || '0'} ${t`粉絲`}`}
      content={(onClose) => (
        <>
          {followersList && followersList.length > 0 ? (
            followersList.map((follower) => (
              <UserConnectionRow
                follower={follower}
                callback={onClose}
                key={`follower-${follower.userCode}`}
              />
            ))
          ) : (
            <div className="px-4">
              <Trans>這裡現在還是空的，粉絲以後就會顯示在這。</Trans>
            </div>
          )}
        </>
      )}
    />
  );
};

export default FollowersListDrawer;
