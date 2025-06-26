import QueryKeys from '@/config/queryKeys';
import axios, { AxiosPayload } from '@/lib/axios';
import useFollowingStore from '@/stores/useFollowingStore';
import useUserStore from '@/stores/useUserStore';
import { SocialLink } from '@/types/Relation';
import { User } from '@/types/User';
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { useRef } from 'react';
import { createOptimisticUpdateHandler } from './optimisticUpdateHandler';

interface FollowActionOptions {
  currentPageUserCode: string;
  currentPageUserID: number;
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
  currentPageUserCode,
  currentPageUserID,
  debounceMs = 5000,
  shouldAllow,
  onNotAllowed,
  onUnauthorized,
  onSuccess,
  onError,
}: FollowActionOptions): FollowActionReturn => {
  const queryClient = useQueryClient();

  const { me } = useUserStore();
  const { setIsFollowing, setFollowerCount } = useFollowingStore();

  const latestSocialLinkRef = useRef<SocialLink | null>(null);

  const updateFollowCache = (
    targetUserID: number,
    isFollowing: boolean,
    countDelta: number
  ) => {
    setIsFollowing(currentPageUserCode, isFollowing);
    setFollowerCount(currentPageUserCode, countDelta);

    const ensureLatestSocialLink = () => {
      if (latestSocialLinkRef.current?.id === targetUserID) return;
      if (targetUserID === currentPageUserID) {
        latestSocialLinkRef.current = {
          id: me.id,
          displayName: me.displayName,
          profileImage: me.profileImage,
          userCode: me.userCode,
          isFollowing,
        };
        return;
      }

      const followers = queryClient.getQueryData<SocialLink[]>([
        QueryKeys.FOLLOWERS,
        currentPageUserID,
      ]);

      const followings = queryClient.getQueryData<SocialLink[]>([
        QueryKeys.FOLLOWING,
        currentPageUserID,
      ]);

      const foundInFollowers = followers?.find(
        (follower) => follower.id === targetUserID
      );
      const foundInFollowing = followings?.find(
        (followings) => followings.id === targetUserID
      );

      latestSocialLinkRef.current =
        foundInFollowers || foundInFollowing || null;
    };

    ensureLatestSocialLink();

    queryClient.setQueryData(
      [QueryKeys.FOLLOWERS, currentPageUserID],
      (followers: SocialLink[]) => {
        if (!followers) return followers;

        const exists = followers.some(
          (follower) => follower.id === latestSocialLinkRef.current?.id
        );

        // 在看別人的Profile & unfollow
        if (exists && targetUserID === currentPageUserID) {
          return followers.filter(
            (follower) => follower.id !== latestSocialLinkRef.current?.id
          );
        }
        // 只要改follow/unfollow
        if (exists) {
          return followers.map((follower) =>
            follower.id === targetUserID
              ? { ...follower, isFollowing }
              : follower
          );
        }

        // 在看別人的Profile & follow
        if (latestSocialLinkRef.current && targetUserID === currentPageUserID) {
          return [
            { ...latestSocialLinkRef.current, isFollowing },
            ...followers,
          ];
        }

        return followers;
      }
    );

    queryClient.setQueryData(
      [QueryKeys.FOLLOWING, currentPageUserID],
      (followings: SocialLink[]) => {
        if (!followings || !latestSocialLinkRef.current) return followings;

        const exists = followings.some(
          (following) => following.id === latestSocialLinkRef.current?.id
        );

        // 在看別人的Profile & follow
        if (targetUserID !== currentPageUserID && !exists) {
          return [
            { ...latestSocialLinkRef.current, isFollowing },
            ...followings,
          ];
        }

        // 在看別人的Profile & unfollow
        if (!isFollowing && targetUserID !== currentPageUserID) {
          return followings.filter(
            (following) => following.id !== latestSocialLinkRef.current?.id
          );
        }

        return followings;
      }
    );

    queryClient.setQueryData(
      [QueryKeys.USER, currentPageUserCode],
      (oldData: User) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          followingCount: (oldData.followingCount || 0) + countDelta,
        };
      }
    );
  };

  const followMutation = useMutation({
    mutationKey: [QueryKeys.USER, currentPageUserCode, 'follow'],
    mutationFn: async (variables: AxiosPayload) => {
      const config: AxiosRequestConfig = {
        url: '/follow',
        method: 'POST' as Method,
        ...(variables?.params && { params: variables.params }),
      };

      return axios.request(config);
    },
    onSuccess: (res: unknown, variables: AxiosPayload) => {
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
    mutationKey: [QueryKeys.USER, currentPageUserCode, 'unfollow'],
    mutationFn: async (variables: AxiosPayload) => {
      const config: AxiosRequestConfig = {
        url: '/unfollow',
        method: 'POST' as Method,
        ...(variables?.params && { params: variables.params }),
      };

      return axios.request(config);
    },
    onSuccess: (res: unknown, variables: AxiosPayload) => {
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

  const createDebouncedAction = (
    mutation: UseMutationResult<unknown, AxiosError, AxiosPayload>,
    optimisticValue: boolean
  ) => {
    return ({ params }: { params: { userID: number } }) => {
      if (shouldAllow && !shouldAllow()) {
        onNotAllowed?.();
        return;
      }

      const debounceKey = `follow-${currentPageUserCode}`;
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
        mutation.mutate(
          { params },
          {
            onError: () => optimisticHandler.rollback(),
          }
        );
        debounceMap.delete(debounceKey);
      }, debounceMs);

      debounceMap.set(debounceKey, timer);
    };
  };

  const follow = createDebouncedAction(followMutation, true);
  const unfollow = createDebouncedAction(unfollowMutation, false);

  const cancelPending = () => {
    const debounceKey = `follow-${currentPageUserCode}`;
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
