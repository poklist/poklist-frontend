import { Button, ButtonVariant } from '@/components/ui/button';
import { useFollowAction } from '@/hooks/mutations/useFollowAction';
import useUserStore from '@/stores/useUserStore';
import { SocialLink } from '@/types/Relation';
import { Trans } from '@lingui/react/macro';
import { useState } from 'react';

export interface UserConnectionRowProps {
  follower: SocialLink;
}

const UserConnectionRow = ({ follower }: UserConnectionRowProps) => {
  const { me } = useUserStore();
  const { follow, unfollow, isPending } = useFollowAction({
    currentPageUserCode: me.userCode,
    currentPageUserID: me.id,
    shouldAllow: () => true,
  });

  const [isFollowing, setIsFollowing] = useState(follower.isFollowing);

  const onClick = () => {
    if (isFollowing) {
      unfollow({ params: { userID: follower.id } });
      setIsFollowing(false);
    } else {
      follow({ params: { userID: follower.id } });
      setIsFollowing(true);
    }
  };

  return (
    <div className="mx-4 flex justify-between" key={follower.userCode}>
      <div
        // onClick={() => navigateTo.user(follower.userCode)}
        className="flex items-center gap-2"
      >
        <img
          src={follower.profileImage}
          alt={`icon-${follower.displayName}`}
          className="h-12 w-12 rounded-full border border-black-text-01"
        />
        <div className="text-t1 font-semibold">
          {follower.displayName}
          <div className="text-black-tint-04">@{follower.userCode}</div>
        </div>
      </div>
      {me.id !== follower.id && (
        <Button
          disabled={isPending}
          onClick={() => onClick()}
          variant={isFollowing ? ButtonVariant.GRAY : ButtonVariant.BLACK}
          className="font-normal"
        >
          {isFollowing ? <Trans>Followings</Trans> : <Trans>Follow</Trans>}
        </Button>
      )}
    </div>
  );
};

export default UserConnectionRow;
