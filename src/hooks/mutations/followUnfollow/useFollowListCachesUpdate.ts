import { followersContract, followingsContract } from '@/api/contracts';
import { TsRestCacheEntry } from '@/api/fetcher';
import { GetFollowersResponse } from '@/api/query/followers';
import { GetFollowingsResponse } from '@/api/query/followings';
import followersKeys from '@/hooks/api/followers/keys';
import followingsKeys from '@/hooks/api/followings/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import { FollowTarget } from '@/hooks/mutations/followUnfollow/schema';
import useUserStore from '@/stores/useUserStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

type SocialLinkEntry = GetFollowersResponse['content'][number];

interface UseFollowListCacheUpdaterOptions {
  listOwnerUserID: FollowTarget['userID'];
}

export const useFollowListCacheUpdater = ({
  listOwnerUserID,
}: UseFollowListCacheUpdaterOptions) => {
  const queryClient = useQueryClient();
  const { me } = useUserStore();

  const latestSocialLinkRef = useRef<SocialLinkEntry | null>(null);

  const ensureLatestSocialLink = (targetUserID: FollowTarget['userID']) => {
    if (latestSocialLinkRef.current?.id === targetUserID) return;

    if (targetUserID === listOwnerUserID) {
      latestSocialLinkRef.current = {
        id: me.id,
        displayName: me.displayName,
        profileImage: me.profileImage,
        userCode: me.userCode,
        isFollowing: false,
      };
      return;
    }

    const followersResponse = queryClient.getQueryData<
      TsRestCacheEntry<GetFollowersResponse>
    >(followersKeys.user(listOwnerUserID));
    const followingsResponse = queryClient.getQueryData<
      TsRestCacheEntry<GetFollowingsResponse>
    >(followingsKeys.user(listOwnerUserID));

    const foundInFollowers = followersResponse?.body.content.find(
      (follower) => follower.id === targetUserID
    );
    const foundInFollowings = followingsResponse?.body.content.find(
      (following) => following.id === targetUserID
    );

    latestSocialLinkRef.current = foundInFollowers ?? foundInFollowings ?? null;
  };

  const updateListCaches = (
    targetUserID: FollowTarget['userID'],
    isFollowing: boolean
  ) => {
    ensureLatestSocialLink(targetUserID);

    // listOwner 的 Followers start
    updateEntryCaches<typeof followersContract.getFollowersContract>(
      queryClient,
      followersKeys.user(listOwnerUserID),
      (previousBody) => {
        if (!Array.isArray(previousBody.content)) return previousBody;

        // Case A: target 非頁面主人 -> follow/unfollow -> 只切 isFollowing flag
        if (targetUserID !== listOwnerUserID) {
          return {
            ...previousBody,
            content: previousBody.content.map((follower) =>
              follower.id === targetUserID
                ? { ...follower, isFollowing }
                : follower
            ),
          };
        }

        // Case B: target 是頁面主人 -> 在別人 profile Follow/Unfollow -> 自己看著 target 的 list
        if (!isFollowing) {
          return {
            ...previousBody,
            content: previousBody.content.filter(
              (follower) => follower.id !== me.id
            ),
          };
        }
        const alreadyExists = previousBody.content.some(
          (follower) => follower.id === me.id
        );
        if (alreadyExists || !latestSocialLinkRef.current) return previousBody;
        return {
          ...previousBody,
          content: [
            { ...latestSocialLinkRef.current, isFollowing },
            ...previousBody.content,
          ],
        };
      }
    );

    // listOwner 的 Followings start
    updateEntryCaches<typeof followingsContract.getFollowingsContract>(
      queryClient,
      followingsKeys.user(listOwnerUserID),
      (previousBody) => {
        if (!Array.isArray(previousBody.content)) return previousBody;

        // listOwner 不會出現在自己的 followings 且只有"我自己"的 followings 會因我 follow/unfollow 而變
        if (targetUserID === listOwnerUserID) return previousBody;
        if (listOwnerUserID !== me.id) return previousBody;

        // 我 unfollow target -> 從我的 followings remove
        if (!isFollowing) {
          return {
            ...previousBody,
            content: previousBody.content.filter(
              (following) => following.id !== targetUserID
            ),
          };
        }

        // 我 follow target -> 加進我的 followings
        const alreadyExists = previousBody.content.some(
          (following) => following.id === targetUserID
        );
        if (alreadyExists || !latestSocialLinkRef.current) return previousBody;
        return {
          ...previousBody,
          content: [
            { ...latestSocialLinkRef.current, isFollowing },
            ...previousBody.content,
          ],
        };
      }
    );
  };

  return { updateListCaches };
};
