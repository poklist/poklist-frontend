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
          {followingList?.length || '0'} <Trans>正追蹤</Trans>
        </>
      }
      headerTitle={`${followingList?.length || '0'} ${t`正追蹤`}`}
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
              <Trans>這裡現在還是空的，追蹤朋友以後就會顯示在這。</Trans>
            </div>
          )}
        </>
      )}
    />
  );
};

export default FollowingListDrawer;
