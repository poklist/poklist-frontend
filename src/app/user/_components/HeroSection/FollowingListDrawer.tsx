import { GetFollowingsResponse } from '@/api/query/followings';
import FollowRelationsDrawer from '@/app/user/_components/FollowRelationsDrawer';
import UserConnectionRow from '@/app/user/_components/UserConnectionRow';
import { t, Trans } from '@lingui/macro';

export interface FollowingListDrawerProps {
  followingList: GetFollowingsResponse['content'] | undefined;
}

const FollowingListDrawer = ({ followingList }: FollowingListDrawerProps) => {
  return (
    <FollowRelationsDrawer
      drawerTrigger={
        <>
          {followingList?.length || '0'} <Trans>Following</Trans>
        </>
      }
      headerTitle={`${followingList?.length || '0'} ${t`Following`}`}
      content={(onClose) => (
        <>
          {followingList && followingList.length > 0 ? (
            followingList.map((following) => (
              <UserConnectionRow
                follower={following}
                callback={onClose}
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
      )}
    />
  );
};

export default FollowingListDrawer;
