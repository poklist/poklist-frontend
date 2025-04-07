import axios from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Method } from 'axios';
import debounce from 'lodash.debounce';
import { useMemo } from 'react';

interface AxiosPayload {
  params?: Record<string, any>;
  data?: any;
}

interface SocialActionOptions {
  actionKey: string; // 用於 cache key，例如 ["posts"]
  url: string;
  method?: Method; // POST / DELETE 等
  debounceMs?: number;
  optimisticUpdate?: (queryClient: any, variables: AxiosPayload) => void;

  shouldAllow?: () => boolean; // ✅ Pre-fire check
  onNotAllowed?: () => void; // ✅ Custom handling (e.g., redirect to login page)
  onOptimisticUpdate?: () => void;

  onUnauthorized?: () => void; // ✅ Handling for unauthorized access on backend error
  onSuccess?: (data?: any, variables?: AxiosPayload) => void; // ✅ Custom handling on success
  onError?: (error?: any, variables?: AxiosPayload) => void; // ✅ Custom handling on error
}

export const useSocialAction = ({
  actionKey,
  url,
  method = 'POST',
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

  const mutation = useMutation({
    mutationKey: [actionKey],
    mutationFn: async ({ params, data }: AxiosPayload) => {
      return axios.request({
        url,
        method,
        params,
        data,
      });
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

  const debouncedMutate = useMemo(() => {
    return (variables: AxiosPayload) => {
      if (shouldAllow && !shouldAllow()) {
        onNotAllowed?.();
        return;
      }
      onOptimisticUpdate?.();
      debounce((variables: AxiosPayload) => {
        mutation.mutate(variables);
      }, debounceMs)(variables);
    };
  }, [debounceMs, mutation, shouldAllow, onNotAllowed, onOptimisticUpdate]);

  return {
    ...mutation,
    debouncedMutate, // 支援參數的 debounce mutate
  };
};
