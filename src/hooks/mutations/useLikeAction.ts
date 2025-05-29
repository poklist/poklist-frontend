import axios, { AxiosPayload } from '@/lib/axios';
import useLikeStore from '@/stores/useLikeStore';
import QueryKeys from '@/config/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Method } from 'axios';
import { useRef } from 'react';

interface LikeActionOptions {
  listID: string;
  debounceMs?: number;
  shouldAllow?: () => boolean;
  onNotAllowed?: () => void;
  onUnauthorized?: () => void;
  onSuccess?: (res?: unknown, variables?: AxiosPayload) => void;
  onError?: (error?: unknown, variables?: AxiosPayload) => void;
}

interface LikeActionReturn {
  like: (variables?: AxiosPayload) => void;
  unlike: (variables?: AxiosPayload) => void;
  cancelPending: () => void;
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: unknown;
  data: unknown;
}

const debounceMap = new Map<string, ReturnType<typeof setTimeout>>();

export const useLikeAction = ({
  listID,
  debounceMs = 5000,
  shouldAllow,
  onNotAllowed,
  onUnauthorized,
  onSuccess,
  onError,
}: LikeActionOptions): LikeActionReturn => {
  const queryClient = useQueryClient();
  const latestParamsRef = useRef<AxiosPayload | null>(null);
  const { setIsLiked } = useLikeStore();

  const likeMutation = useMutation({
    mutationKey: [QueryKeys.LIST, listID, 'like'],
    mutationFn: async (variables: AxiosPayload) => {
      latestParamsRef.current = variables;

      const config = {
        url: '/like',
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
      // invalidate 所有與該 listID 相關的 queries (不管 offset/limit)
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.LIST, listID],
        exact: false, // 這會讓所有以 [QueryKeys.LIST, listID] 開頭的 queries 都被 invalidate
      });
      // invalidate 所有 lists queries (用於列表頁面)
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.LISTS],
        exact: false,
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationKey: [QueryKeys.LIST, listID, 'unlike'],
    mutationFn: async (variables: AxiosPayload) => {
      latestParamsRef.current = variables;

      const config = {
        url: '/unlike',
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
      // invalidate 所有與該 listID 相關的 queries (不管 offset/limit)
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.LIST, listID],
        exact: false,
      });
      // invalidate 所有 lists queries (用於列表頁面)
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.LISTS],
        exact: false,
      });
    },
  });

  const createDebouncedAction = (mutation: any, optimisticValue: boolean) => {
    return (variables: AxiosPayload = {}) => {
      if (shouldAllow && !shouldAllow()) {
        onNotAllowed?.();
        return;
      }

      const debounceKey = `like-${listID}`;
      const existingTimer = debounceMap.get(debounceKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // 樂觀更新
      setIsLiked(listID, optimisticValue);

      const timer = setTimeout(() => {
        mutation.mutate(variables);
        debounceMap.delete(debounceKey);
      }, debounceMs);

      debounceMap.set(debounceKey, timer);
    };
  };

  const like = createDebouncedAction(likeMutation, true);
  const unlike = createDebouncedAction(unlikeMutation, false);

  const cancelPending = () => {
    const debounceKey = `like-${listID}`;
    const existingTimer = debounceMap.get(debounceKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
      debounceMap.delete(debounceKey);
    }
  };

  // 回傳任一 mutation 的狀態（因為同時只會有一個 active）
  const activeMutation = likeMutation.isPending ? likeMutation : unlikeMutation;

  return {
    like,
    unlike,
    cancelPending,
    isLoading: activeMutation.isPending,
    isPending: activeMutation.isPending,
    isError: activeMutation.isError,
    isSuccess: activeMutation.isSuccess,
    error: activeMutation.error,
    data: activeMutation.data,
  };
};
