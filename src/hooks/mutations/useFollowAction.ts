import {
  followersContract,
  followingsContract,
  usersContract,
} from '@/api/contracts';
import { TanStackCache } from '@/api/fetcher';
import { GetFollowersResponse } from '@/api/query/followers';
import { GetUserInfoResponse } from '@/api/query/users';
import QueryKeys from '@/constants/queryKeys';
import { usePostFollowUser } from '@/hooks/api/follow/usePostFollowUser';
import followersKeys from '@/hooks/api/followers/keys';
import followingsKeys from '@/hooks/api/followings/keys';
import { usePostUnfollowUser } from '@/hooks/api/unfollow/usePostUnfollowUser';
import usersKeys from '@/hooks/api/users/keys';
import {
  FollowActionOptions,
  FollowActionReturn,
} from '@/hooks/mutations/followUnfollow/schema';
import { createOptimisticUpdateHandler } from '@/hooks/mutations/optimistic/optimisticUpdateHandler';
import useFollowingStore from '@/stores/useFollowingStore';
import useUserStore from '@/stores/useUserStore';
import { useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';
import { useRef } from 'react';

// interface FollowTarget {
//   userID: number;
//   userCode: string;
// }

// interface FollowActionOptions {
//   target: FollowTarget;
//   listOwner?: { userID: number; userCode: string };
//   currentUserCode: string;
//   currentUserID: number;
//   debounceMs?: number;
//   shouldAllow?: () => boolean;
//   onNotAllowed?: () => void;
//   onSuccess?: (data: PostFollowResponse['content']) => void;
//   onError?: (
//     error: unknown,
//     request?: PostFollowRequest | PostUnfollowRequest
//   ) => void;
// }

// interface FollowActionReturn {
//   follow: () => void;
//   unfollow: () => void;
//   cancelPending: () => void;
//   isLoading: boolean;
//   isPending: boolean;
//   isError: boolean;
//   isSuccess: boolean;
//   error: unknown;
//   data: unknown;
// }

const debounceMap = new Map<string, ReturnType<typeof setTimeout>>();

export const useFollowAction = ({
  target,
  currentUserCode,
  currentUserID,
  debounceMs = 5000,
  shouldAllow,
  onNotAllowed,
  onSuccess,
  onError,
}: FollowActionOptions): FollowActionReturn => {
  const queryClient = useQueryClient();

  const { me } = useUserStore();
  const {
    setIsFollowing,
    getConfirmedIsFollowing,
    hasConfirmedFollowingState,
  } = useFollowingStore();

  const latestSocialLinkRef = useRef<
    GetFollowersResponse['content'][number] | null
  >(null);

  const updateFollowCache = (
    targetUserID: number,
    isFollowing: boolean,
    countDelta: number
  ) => {
    setIsFollowing(target.userCode, isFollowing);
    // setFollowerCount(currentUserCode, countDelta);

    const ensureLatestSocialLink = () => {
      if (latestSocialLinkRef.current?.id === targetUserID) return;
      if (targetUserID === currentUserID) {
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
        followersKeys.user(currentUserID)
      );

      const followingsResponse = queryClient.getQueryData<GetFollowersResponse>(
        followingsKeys.user(currentUserID)
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

      latestSocialLinkRef.current =
        foundInFollowers || foundInFollowing || null;
    };

    ensureLatestSocialLink();

    queryClient.setQueryData<
      TanStackCache<
        ClientInferResponseBody<
          typeof followersContract.getFollowersContract,
          200
        >
      >
    >(followersKeys.user(currentUserID), (followersResponse) => {
      if (!followersResponse) return followersResponse;

      const exists = Array.isArray(followersResponse.body.content)
        ? followersResponse.body.content.some(
            (follower) => follower.id === latestSocialLinkRef.current?.id
          )
        : false;

      // 在看別人的Profile & unfollow
      if (exists && targetUserID === currentUserID) {
        return {
          ...followersResponse,
          body: {
            ...followersResponse.body,
            content: followersResponse.body.content.filter(
              (follower) => follower.id !== latestSocialLinkRef.current?.id
            ),
          },
        };
      }
      // 只要改follow/unfollow
      if (exists) {
        return {
          ...followersResponse,
          body: {
            ...followersResponse.body,
            content: followersResponse.body.content.map((follower) =>
              follower.id === targetUserID
                ? { ...follower, isFollowing }
                : follower
            ),
          },
        };
      }

      // 在看別人的Profile & follow
      if (latestSocialLinkRef.current && targetUserID === currentUserID) {
        return {
          ...followersResponse,
          body: {
            ...followersResponse.body,
            content: [
              { ...latestSocialLinkRef.current, isFollowing },
              ...followersResponse.body.content,
            ],
          },
        };
      }

      return followersResponse;
    });

    queryClient.setQueryData<
      TanStackCache<
        ClientInferResponseBody<
          typeof followingsContract.getFollowingsContract,
          200
        >
      >
    >(followingsKeys.user(currentUserID), (followingsResponse) => {
      if (!followingsResponse || !latestSocialLinkRef.current)
        return followingsResponse;

      const exists = followingsResponse.body.content.some(
        (following) => following.id === latestSocialLinkRef.current?.id
      );

      // 在看別人的Profile & follow
      if (targetUserID !== currentUserID && !exists) {
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
      if (!isFollowing && targetUserID !== currentUserID) {
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

    queryClient.setQueryData(
      [QueryKeys.USER, currentUserCode],
      (oldData: GetUserInfoResponse['content']) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          followingCount: (oldData.followingCount || 0) + countDelta,
        };
      }
    );
    queryClient.setQueryData<
      TanStackCache<
        ClientInferResponseBody<typeof usersContract.getInfoContract, 200>
      >
    >(usersKeys.userInfo(currentUserCode), (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        body: {
          ...oldData.body,
          content: {
            ...oldData.body.content,
            followingCount:
              (oldData.body.content.followingCount || 0) + countDelta,
          },
        },
      };
    });
  };

  const followMutation = usePostFollowUser({
    targetUserCode: target.userCode,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error, request) => {
      // rollback delta，從 request 取回 target
      createOptimisticUpdateHandler(
        1,
        request.userID,
        updateFollowCache
      ).rollback();
      onError?.(error, request);
    },
  });

  const unfollowMutation = usePostUnfollowUser({
    targetUserCode: target.userCode,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error, request) => {
      // rollback delta，從 request 取回 target
      createOptimisticUpdateHandler(
        -1,
        request.userID,
        updateFollowCache
      ).rollback();
      onError?.(error, request);
    },
  });

  const createDebouncedAction = (optimisticValue: boolean) => {
    return () => {
      const { userID, userCode } = target;
      if (shouldAllow && !shouldAllow()) {
        onNotAllowed?.();
        return;
      }

      // key 在 target 上：不同 target 各自有 debounce timer，互不干擾
      const debounceKey = `follow-${userCode}`;
      clearTimeout(debounceMap.get(debounceKey));
      const delta = optimisticValue ? 1 : -1;

      // 樂觀更新
      createOptimisticUpdateHandler(
        delta,
        userID,
        updateFollowCache
      ).optimisticUpdate();

      const timer = setTimeout(() => {
        debounceMap.delete(debounceKey);
        // confirmed 比對拿 target 的，不是拿 currentUserCode 的
        if (
          hasConfirmedFollowingState(userCode) &&
          optimisticValue === getConfirmedIsFollowing(userCode)
        )
          return;

        const targetMutation = optimisticValue
          ? followMutation
          : unfollowMutation;
        targetMutation.mutate({ query: { userID }, body: {} });
      }, debounceMs);

      debounceMap.set(debounceKey, timer);
    };
  };

  const follow = createDebouncedAction(true);
  const unfollow = createDebouncedAction(false);

  const cancelPending = () => {
    const debounceKey = `follow-${target.userCode}`;
    const existingTimer = debounceMap.get(debounceKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
      debounceMap.delete(debounceKey);
    }
  };

  // 回傳任一 mutation 的狀態（因為同時只會有一個 active）
  const activeMutation = followMutation.isPending
    ? followMutation
    : unfollowMutation;

  return {
    follow,
    unfollow,
    cancelPending,
    isLoading: activeMutation.isPending,
    isPending: activeMutation.isPending,
    isError: activeMutation.isError,
    isSuccess: activeMutation.isSuccess,
    error: activeMutation.error,
    data: activeMutation.data,
  };
};
