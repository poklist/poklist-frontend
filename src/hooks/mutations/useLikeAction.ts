import axios, { AxiosPayload } from '@/api/axios';
import QueryKeys from '@/constants/queryKeys';
import useLikeStore from '@/stores/useLikeStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig, Method } from 'axios';
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
  const latestParamsRef = useRef<AxiosPayload | null>(null);
  const { setIsLiked, getConfirmedIsLiked, setConfirmedIsLiked } =
    useLikeStore();

  // 共用 onError rollback
  const handleMutationError = (
    error: AxiosError,
    variables: AxiosPayload,
    confirmedValue: boolean
  ) => {
    setIsLiked(listID, confirmedValue);
    if (error.response?.status === 401) {
      onUnauthorized?.();
    } else {
      onError?.(error, variables);
    }
  };

  const likeMutation = useMutation({
    mutationKey: [QueryKeys.LIST, listID, 'like'],
    mutationFn: async (variables: AxiosPayload) => {
      latestParamsRef.current = variables;

      const config = {
        url: '/like',
        method: 'POST' satisfies Method,
        ...(variables?.params && { params: variables.params }),
      } satisfies AxiosRequestConfig;

      return axios.request(config);
    },
    onSuccess: (res: unknown, variables: AxiosPayload) => {
      // 更新 confirmed 狀態
      setConfirmedIsLiked(listID, true);
      onSuccess?.(res, variables);
    },
    onError: (error: AxiosError, variables: AxiosPayload) => {
      handleMutationError(error, variables, false);
    },
  });

  const unlikeMutation = useMutation({
    mutationKey: [QueryKeys.LIST, listID, 'unlike'],
    mutationFn: async (variables: AxiosPayload) => {
      latestParamsRef.current = variables;

      const config: AxiosRequestConfig = {
        url: '/unlike',
        method: 'POST' satisfies Method,
        ...(variables?.params && { params: variables.params }),
      };

      return axios.request(config);
    },
    onSuccess: (res: unknown, variables: AxiosPayload) => {
      setConfirmedIsLiked(listID, false);
      onSuccess?.(res, variables);
    },
    onError: (error: AxiosError, variables: AxiosPayload) => {
      handleMutationError(error, variables, true);
    },
  });

  const createDebouncedAction = (optimisticValue: boolean) => {
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
        debounceMap.delete(debounceKey);

        // 狀態比對
        const confirmedValue = getConfirmedIsLiked(listID);
        if (optimisticValue === confirmedValue) {
          return;
        }

        // 依 optimistic 狀態選擇正確 mutation
        const targetMutation = optimisticValue ? likeMutation : unlikeMutation;
        targetMutation.mutate(variables);
      }, debounceMs);

      debounceMap.set(debounceKey, timer);
    };
  };

  const like = createDebouncedAction(true);
  const unlike = createDebouncedAction(false);

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
