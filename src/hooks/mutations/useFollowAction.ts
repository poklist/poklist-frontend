import axios, { AxiosPayload } from '@/lib/axios';
import useRelationStore from '@/stores/useRelationStore';
import QueryKeys from '@/config/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Method } from 'axios';
import { useRef } from 'react';

interface FollowActionOptions {
  userCode: string;
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
  userCode,
  debounceMs = 5000,
  shouldAllow,
  onNotAllowed,
  onUnauthorized,
  onSuccess,
  onError,
}: FollowActionOptions): FollowActionReturn => {
  const queryClient = useQueryClient();
  const latestParamsRef = useRef<AxiosPayload | null>(null);
  const { setIsFollowing, clearFollowingStatus } = useRelationStore();

  const followMutation = useMutation({
    mutationKey: [QueryKeys.USER, userCode, 'follow'],
    mutationFn: async (variables: AxiosPayload) => {
      latestParamsRef.current = variables;

      const config = {
        url: '/follow',
        method: 'POST' as Method,
        ...(variables?.params && { params: variables.params }),
        ...(variables?.data && { data: variables.data }),
      };

      return axios.request(config);
    },
    onSuccess: (res: unknown, variables: AxiosPayload) => {
      onSuccess?.(res, variables);
    },
    onError: (error: unknown, variables: AxiosPayload) => {
      if ((error as any)?.response?.status === 401) {
        onUnauthorized?.();
      } else {
        onError?.(error, variables);
      }
    },
    onSettled: async () => {
      clearFollowingStatus(userCode);
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER, userCode],
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationKey: [QueryKeys.USER, userCode, 'unfollow'],
    mutationFn: async (variables: AxiosPayload) => {
      latestParamsRef.current = variables;

      const config = {
        url: '/unfollow',
        method: 'POST' as Method,
        ...(variables?.params && { params: variables.params }),
        ...(variables?.data && { data: variables.data }),
      };

      return axios.request(config);
    },
    onSuccess: (res: unknown, variables: AxiosPayload) => {
      onSuccess?.(res, variables);
    },
    onError: (error: unknown, variables: AxiosPayload) => {
      if ((error as any)?.response?.status === 401) {
        onUnauthorized?.();
      } else {
        onError?.(error, variables);
      }
    },
    onSettled: async () => {
      clearFollowingStatus(userCode);
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER, userCode],
      });
    },
  });

  const createDebouncedAction = (mutation: any, optimisticValue: boolean) => {
    return (variables: { params: { userID: number } }) => {
      if (shouldAllow && !shouldAllow()) {
        onNotAllowed?.();
        return;
      }

      const debounceKey = `follow-${userCode}`;
      const existingTimer = debounceMap.get(debounceKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // 樂觀更新
      setIsFollowing(userCode, optimisticValue);

      const timer = setTimeout(() => {
        mutation.mutate(variables);
        debounceMap.delete(debounceKey);
      }, debounceMs);

      debounceMap.set(debounceKey, timer);
    };
  };

  const follow = createDebouncedAction(followMutation, true);
  const unfollow = createDebouncedAction(unfollowMutation, false);

  const cancelPending = () => {
    const debounceKey = `follow-${userCode}`;
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
