import FollowRelationsDrawer from '@/pages/User/Components/FollowRelationsDrawer';
import { SocialLink } from '@/types/Relation';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import UserConnectionRow from '../Components/UserConnectionRow';

export interface FollowersListDrawerProps {
  followersList: SocialLink[] | undefined;
}

const FollowersListDrawer = ({ followersList }: FollowersListDrawerProps) => {
  return (
    <FollowRelationsDrawer
      drawerTrigger={
        <>
          {followersList?.length || ' '} <Trans>Followers</Trans>
        </>
      }
      headerTitle={`${followersList?.length || ' '} ${t`Followers`}`}
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
              <Trans>Empty for now, but followers will appear here soon.</Trans>
            </div>
          )}
        </>
      )}
    />
  );
};

export default FollowersListDrawer;
