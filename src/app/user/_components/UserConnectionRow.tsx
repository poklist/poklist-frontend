import { GetFollowersResponse } from '@/api/query/followers';
import { Button, ButtonVariant } from '@/components/ui/button';
import { useFollowAction } from '@/hooks/mutations/followUnfollow/useFollowAction';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import useFollowingStore from '@/stores/useFollowingStore';
import useUserStore from '@/stores/useUserStore';
import { SocialLink } from '@/types/Relation';
import { Trans } from '@lingui/macro';
import Image from 'next/image';
import { useEffect } from 'react';

export interface UserConnectionRowProps {
  follower: GetFollowersResponse['content'][number] | SocialLink;
  callback: () => void;
}

const UserConnectionRow = ({ follower, callback }: UserConnectionRowProps) => {
  const navigateTo = useStrictNavigateNext();
  const { me } = useUserStore();
  const { follow, unfollow, isLoading } = useFollowAction({
    target: { userID: follower.id, userCode: follower.userCode },
    currentUserCode: me.userCode,
    currentUserID: me.id,
    shouldAllow: () => true,
  });

  const { setConfirmedIsFollowing } = useFollowingStore();

  const onClick = () => {
    if (follower.isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  useEffect(() => {
    setConfirmedIsFollowing(follower.userCode, follower.isFollowing ?? false);
  }, [follower.userCode, follower.isFollowing]);

  return (
    <div className="mx-4 flex justify-between" key={follower.userCode}>
      <div
        onClick={() => {
          navigateTo.user(follower.userCode);
          callback();
        }}
        className="flex items-center gap-2"
      >
        <Image
          priority={true}
          src={follower.profileImage || ''}
          width={48}
          height={48}
          alt={`icon-${follower.displayName}`}
          className="rounded-full border border-black-text-01"
        />
        <div className="text-t1 font-semibold">
          {follower.displayName}
          <div className="text-black-tint-04">@{follower.userCode}</div>
        </div>
      </div>
      {me.id !== follower.id && (
        <Button
          disabled={isLoading}
          onClick={() => onClick()}
          variant={
            follower.isFollowing ? ButtonVariant.GRAY : ButtonVariant.BLACK
          }
          className="font-normal"
        >
          {follower.isFollowing ? (
            <Trans>Followings</Trans>
          ) : (
            <Trans>Follow</Trans>
          )}
        </Button>
      )}
    </div>
  );
};

export default UserConnectionRow;
