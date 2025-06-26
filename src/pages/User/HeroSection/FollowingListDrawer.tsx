import { SocialLink } from '@/types/Relation';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import FollowRelationsDrawer from '../Components/FollowRelationsDrawer';
import UserConnectionRow from '../Components/UserConnectionRow';

export interface FollowingListDrawerProps {
  userID: number;
  followingList: SocialLink[] | undefined;
}

const FollowingListDrawer = ({
  userID,
  followingList,
}: FollowingListDrawerProps) => {
  return (
    <FollowRelationsDrawer
      userID={userID}
      drawerTrigger={
        <>
          {followingList?.length || '0'} <Trans>Following</Trans>
        </>
      }
      headerTitle={`${followingList?.length || '0'} ${t`Following`}`}
      content={
        <>
          {followingList && followingList.length > 0 ? (
            followingList.map((following) => (
              <UserConnectionRow
                follower={following}
                key={`following-${following.userCode}`}
              />
            ))
          ) : (
            <div className="px-4">
              <Trans>
                Empty for now, but followings will appear here soon.
              </Trans>
            </div>
          )}
        </>
      }
    />
  );
};

export default FollowingListDrawer;
