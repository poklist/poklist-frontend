import { followersContract, followingsContract } from '@/api/contracts';
import { TanStackCache } from '@/api/fetcher';
import { GetFollowersResponse } from '@/api/query/followers';
import { GetFollowingsResponse } from '@/api/query/followings';
import followersKeys from '@/hooks/api/followers/keys';
import followingsKeys from '@/hooks/api/followings/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import { FollowTarget } from '@/hooks/mutations/followUnfollow/schema';
import useUserStore from '@/stores/useUserStore';
import { useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';
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

  const ensureLatestSocialLink = (
    targetUserID: FollowTarget['userID'],
    isFollowing: boolean
  ) => {
    if (latestSocialLinkRef.current?.id === targetUserID) return;
    if (targetUserID === listOwnerUserID) {
      latestSocialLinkRef.current = {
        id: me.id,
        displayName: me.displayName,
        profileImage: me.profileImage,
        userCode: me.userCode,
        isFollowing,
      };
      return;
    }

    const followersResponse = queryClient.getQueryData<GetFollowersResponse>(
      followersKeys.user(listOwnerUserID)
    );

    const followingsResponse = queryClient.getQueryData<GetFollowingsResponse>(
      followingsKeys.user(listOwnerUserID)
    );

    const foundInFollowers = Array.isArray(followersResponse?.content)
      ? followersResponse.content.find(
          (follower) => follower.id === targetUserID
        )
      : undefined;
    const foundInFollowing = Array.isArray(followingsResponse?.content)
      ? followingsResponse.content.find(
          (followings) => followings.id === targetUserID
        )
      : undefined;

    latestSocialLinkRef.current = foundInFollowers || foundInFollowing || null;
  };

  // FIXME 未考慮到在別人的Followers/Followings中Follow/Unfollow的更新
  const updateListCaches = (
    targetUserID: FollowTarget['userID'],
    isFollowing: boolean
  ) => {
    ensureLatestSocialLink(targetUserID, isFollowing);

    updateEntryCaches<typeof followersContract.getFollowersContract>(
      queryClient,
      followersKeys.user(listOwnerUserID),
      (previousBody) => {
        const exists = Array.isArray(previousBody.content)
          ? previousBody.content.some(
              (follower) => follower.id === latestSocialLinkRef.current?.id
            )
          : false;

        // 在看別人的Profile & unfollow
        if (exists && targetUserID === listOwnerUserID) {
          return {
            ...previousBody,
            content: previousBody.content.filter(
              (follower) => follower.id !== latestSocialLinkRef.current?.id
            ),
          };
        }
        // 只要改follow/unfollow
        if (exists) {
          return {
            ...previousBody,
            content: previousBody.content.map((follower) =>
              follower.id === targetUserID
                ? { ...follower, isFollowing }
                : follower
            ),
          };
        }

        // 在看別人的Profile & follow
        if (latestSocialLinkRef.current && targetUserID === listOwnerUserID) {
          return {
            ...previousBody,
            content: [
              { ...latestSocialLinkRef.current, isFollowing },
              ...previousBody.content,
            ],
          };
        }

        return previousBody;
      }
    );

    // updateEntryCaches<typeof followingsContract.getFollowingsContract>(queryClient, followingsKeys.user(listOwnerUserID), (previousBody) => {
    //   const exists = previousBody.content.some(
    //     (following) => following.id === latestSocialLinkRef.current?.id
    //   );

    //   // 在看別人的Profile & follow
    //   if (targetUserID !== listOwnerUserID && !exists) {
    //     return {
    //       ...previousBody,
    //       content: [
    //         { ...latestSocialLinkRef.current, isFollowing },
    //         ...previousBody.content,
    //       ],
    //     };
    //   }

    //   // 在看別人的Profile & unfollow
    //   if (!isFollowing && targetUserID !== listOwnerUserID) {
    //     return {
    //       ...previousBody,
    //       content: previousBody.content.filter(
    //         (following) => following.id !== latestSocialLinkRef.current?.id
    //       ),
    //     };
    //   }

    //   return previousBody;
    // });

    queryClient.setQueryData<
      TanStackCache<
        ClientInferResponseBody<
          typeof followingsContract.getFollowingsContract,
          200
        >
      >
    >(followingsKeys.user(listOwnerUserID), (followingsResponse) => {
      if (!followingsResponse || !latestSocialLinkRef.current)
        return followingsResponse;

      const exists = followingsResponse.body.content.some(
        (following) => following.id === latestSocialLinkRef.current?.id
      );

      // 在看別人的Profile & follow
      if (targetUserID !== listOwnerUserID && !exists) {
        return {
          ...followingsResponse,
          body: {
            ...followingsResponse.body,
            content: [
              { ...latestSocialLinkRef.current, isFollowing },
              ...followingsResponse.body.content,
            ],
          },
        };
      }

      // 在看別人的Profile & unfollow
      if (!isFollowing && targetUserID !== listOwnerUserID) {
        return {
          ...followingsResponse,
          body: {
            ...followingsResponse.body,
            content: followingsResponse.body.content.filter(
              (following) => following.id !== latestSocialLinkRef.current?.id
            ),
          },
        };
      }

      return followingsResponse;
    });
  };

  return { updateListCaches };
};
