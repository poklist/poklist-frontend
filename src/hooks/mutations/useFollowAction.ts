import axios, { AxiosPayload } from '@/api/axios';
import {
  followersContract,
  followingsContract,
  userContract,
} from '@/api/contracts';
import { TanStackCache } from '@/api/fetcher';
import { GetFollowersResponse } from '@/api/query/followers';
import { GetUserInfoResponse } from '@/api/query/user';
import QueryKeys from '@/constants/queryKeys';
import followersKeys from '@/hooks/api/followers/keys';
import followingsKeys from '@/hooks/api/followings/keys';
import userKeys from '@/hooks/api/user/keys';
import { createOptimisticUpdateHandler } from '@/hooks/mutations/optimisticUpdateHandler';
import useFollowingStore from '@/stores/useFollowingStore';
import useUserStore from '@/stores/useUserStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientInferResponseBody } from '@ts-rest/core';
import { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { useRef } from 'react';

interface FollowActionOptions {
  currentUserCode: string;
  currentUserID: number;
  debounceMs?: number;
  shouldAllow?: () => boolean;
  onNotAllowed?: () => void;
  onUnauthorized?: () => void;
  onSuccess?: (res?: unknown, variables?: AxiosPayload) => void;
  onError?: (error?: unknown, variables?: AxiosPayload) => void;
}

interface FollowActionReturn {
  follow: (variables: { params: { userID: number } }) => void;
  unfollow: (variables: { params: { userID: number } }) => void;
  cancelPending: () => void;
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: unknown;
  data: unknown;
}

const debounceMap = new Map<string, ReturnType<typeof setTimeout>>();

export const useFollowAction = ({
  currentUserCode,
  currentUserID,
  debounceMs = 5000,
  shouldAllow,
  onNotAllowed,
  onUnauthorized,
  onSuccess,
  onError,
}: FollowActionOptions): FollowActionReturn => {
  const queryClient = useQueryClient();

  const { me } = useUserStore();
  const {
    setIsFollowing,
    setFollowerCount,
    getConfirmedIsFollowing,
    setConfirmedIsFollowing,
  } = useFollowingStore();

  const latestSocialLinkRef = useRef<
    GetFollowersResponse['content'][number] | null
  >(null);

  const updateFollowCache = (
    targetUserID: number,
    isFollowing: boolean,
    countDelta: number
  ) => {
    setIsFollowing(currentUserCode, isFollowing);
    setFollowerCount(currentUserCode, countDelta);

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
        followersKeys.user({ userID: currentUserID })
      );

      const followingsResponse = queryClient.getQueryData<GetFollowersResponse>(
        followingsKeys.user({ userID: currentUserID })
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
    >(followersKeys.user({ userID: currentUserID }), (followersResponse) => {
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
    >(followingsKeys.user({ userID: currentUserID }), (followingsResponse) => {
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
        ClientInferResponseBody<typeof userContract.getInfoContract, 200>
      >
    >(userKeys.userInfo(currentUserCode), (oldData) => {
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

  const followMutation = useMutation({
    mutationKey: [QueryKeys.USER, currentUserCode, 'follow'],
    mutationFn: async (variables: AxiosPayload) => {
      const config: AxiosRequestConfig = {
        url: '/follow',
        method: 'POST' satisfies Method,
        ...(variables?.params && { params: variables.params }),
      };

      return axios.request(config);
    },
    onSuccess: (res: unknown, variables: AxiosPayload) => {
      setConfirmedIsFollowing(currentUserCode, true);
      onSuccess?.(res, variables);
    },
    onError: (error: AxiosError, variables: AxiosPayload) => {
      if (error.response?.status === 401) {
        onUnauthorized?.();
      } else {
        onError?.(error, variables);
      }
    },
  });

  const unfollowMutation = useMutation({
    mutationKey: [QueryKeys.USER, currentUserCode, 'unfollow'],
    mutationFn: async (variables: AxiosPayload) => {
      const config: AxiosRequestConfig = {
        url: '/unfollow',
        method: 'POST' satisfies Method,
        ...(variables?.params && { params: variables.params }),
      };

      return axios.request(config);
    },
    onSuccess: (res: unknown, variables: AxiosPayload) => {
      setConfirmedIsFollowing(currentUserCode, false);
      onSuccess?.(res, variables);
    },
    onError: (error: AxiosError, variables: AxiosPayload) => {
      if (error.response?.status === 401) {
        onUnauthorized?.();
      } else {
        onError?.(error, variables);
      }
    },
  });

  const createDebouncedAction = (optimisticValue: boolean) => {
    return ({ params }: { params: { userID: number } }) => {
      if (shouldAllow && !shouldAllow()) {
        onNotAllowed?.();
        return;
      }

      const debounceKey = `follow-${currentUserCode}`;
      clearTimeout(debounceMap.get(debounceKey));
      const delta = optimisticValue ? 1 : -1;

      const optimisticHandler = createOptimisticUpdateHandler(
        delta,
        params.userID,
        updateFollowCache
      );

      // 樂觀更新
      optimisticHandler.optimisticUpdate();

      const timer = setTimeout(() => {
        debounceMap.delete(debounceKey);

        // 如 Optimistic 已與 confirmed 一致就不打 API
        const confirmedValue = getConfirmedIsFollowing(currentUserCode);
        if (optimisticValue === confirmedValue) {
          return;
        }

        // 依目前 optimistic 期望選正確 mutation
        const targetMutation = optimisticValue
          ? followMutation
          : unfollowMutation;
        targetMutation.mutate(
          { params },
          {
            onError: () => optimisticHandler.rollback(),
          }
        );
      }, debounceMs);

      debounceMap.set(debounceKey, timer);
    };
  };

  const follow = createDebouncedAction(true);
  const unfollow = createDebouncedAction(false);

  const cancelPending = () => {
    const debounceKey = `follow-${currentUserCode}`;
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
