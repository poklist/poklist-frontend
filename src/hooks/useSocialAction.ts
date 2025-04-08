import axios from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Method } from 'axios';
import { useRef } from 'react';

interface AxiosPayload {
  params?: Record<string, any>;
  data?: any;
}

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
  onSuccess?: (data?: any, variables?: AxiosPayload) => void; // ✅ Custom handling on success
  onError?: (error?: any, variables?: AxiosPayload) => void; // ✅ Custom handling on error
}

export enum SocialActionType {
  LIKE = 'like',
  FOLLOW = 'follow',
}

const debounceMap = new Map<SocialActionType, ReturnType<typeof setTimeout>>();

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

  const debouncedMutate = (variables: AxiosPayload) => {
    if (shouldAllow && !shouldAllow()) {
      onNotAllowed?.();
      return;
    }

    const existingTimer = debounceMap.get(debounceGroupKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    onOptimisticUpdate?.();

    const timer = setTimeout(() => {
      mutation.mutate(variables);
      debounceMap.delete(debounceGroupKey);
    }, debounceMs);

    debounceMap.set(debounceGroupKey, timer);
  };

  const cancelPending = () => {
    const existingTimer = debounceMap.get(debounceGroupKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
      debounceMap.delete(debounceGroupKey);
    }
  };

  return {
    ...mutation,
    debouncedMutate, // 支援參數的 debounce mutate
    cancelPending,
    isLoading: mutation.isPending,
  };
};
