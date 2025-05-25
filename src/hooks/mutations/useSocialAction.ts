import axios, { AxiosPayload } from '@/lib/axios';
import { enhancedDebounce } from '@/lib/functional';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Method } from 'axios';
import { useRef } from 'react';

interface SocialActionOptions {
  actionKey: string; // 用於 cache key，例如 ["posts"]
  url: string;
  method?: Method; // POST / DELETE 等
  debounceMs?: number;
  debounceGroupKey: SocialActionType;
  optimisticUpdate?: (queryClient: any, variables: AxiosPayload) => void;

  shouldAllow?: () => boolean; // ✅ Pre-fire check
  onNotAllowed?: () => void; // ✅ Custom handling (e.g., redirect to login page)
  onOptimisticUpdate?: () => void;

  onUnauthorized?: () => void; // ✅ Handling for unauthorized access on backend error
  onSuccess?: (res?: any, variables?: AxiosPayload) => void; // ✅ Custom handling on success
  onError?: (error?: any, variables?: AxiosPayload) => void; // ✅ Custom handling on error
}

export enum SocialActionType {
  LIKE = 'like',
  FOLLOW = 'follow',
}

export const useSocialAction = ({
  actionKey,
  url,
  method = 'POST',
  debounceGroupKey,
  debounceMs = 5000,
  optimisticUpdate,
  shouldAllow,
  onNotAllowed,
  onOptimisticUpdate,
  onUnauthorized,
  onSuccess,
  onError,
}: SocialActionOptions) => {
  const queryClient = useQueryClient();
  const latestParamsRef = useRef<any>(null);

  const mutation = useMutation({
    mutationKey: [actionKey],
    mutationFn: async (variables: AxiosPayload) => {
      latestParamsRef.current = variables;

      const config = {
        url,
        method,
        ...(variables?.params && { params: variables.params }),
        ...(variables?.data && { data: variables.data }),
      };

      return axios.request(config);
    },
    onMutate: async (variables: AxiosPayload) => {
      if (optimisticUpdate) {
        await queryClient.cancelQueries({ queryKey: [actionKey] });
        optimisticUpdate(queryClient, variables);
      }
    },
    onSuccess: (res: any, variables: AxiosPayload) => {
      onSuccess?.(res.data, variables);
    },
    onError: (error: any, variables: AxiosPayload) => {
      if (error?.response?.status === 401) {
        onUnauthorized?.();
      } else {
        onError?.(error, variables);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [actionKey] });
    },
  });

  const debounceMap = new Map<
    SocialActionType,
    ReturnType<typeof setTimeout>
  >();

  const debouncedMutate = enhancedDebounce(
    (variables: AxiosPayload) => mutation.mutate(variables),
    debounceMs,
    {
      shouldExecute: shouldAllow,
      onNotAllowed,
      onBeforeExecute: onOptimisticUpdate,
      onAfterExecute: () => debounceMap.delete(debounceGroupKey),
    }
  );

  const cancelPending = () => {
    const existingTimer = debounceMap.get(debounceGroupKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
      debounceMap.delete(debounceGroupKey);
    }
  };

  return {
    mutation,
    debouncedMutate,
    cancelPending,
    isLoading: mutation.isPending,
  };
};
