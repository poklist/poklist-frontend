import { Button, ButtonVariant } from '@/components/ui/button';
import { useFollowAction } from '@/hooks/mutations/useFollowAction';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import useUserStore from '@/stores/useUserStore';
import { SocialLink } from '@/types/Relation';
import { Trans } from '@lingui/react/macro';
import Image from 'next/image';
import { useState } from 'react';

export interface UserConnectionRowProps {
  follower: SocialLink;
  callback: () => void;
}

const UserConnectionRow = ({ follower, callback }: UserConnectionRowProps) => {
  const navigateTo = useStrictNavigateNext();
  const { me } = useUserStore();
  const { follow, unfollow, isLoading } = useFollowAction({
    currentUserCode: me.userCode,
    currentUserID: me.id,
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
