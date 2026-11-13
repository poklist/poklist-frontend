import { creatorListsContract } from '@/api/contracts';
import {
  creatorListsQuery,
  IncreaseCapacityResponse,
} from '@/api/query/creatorLists';
import listsKeys from '@/hooks/api/lists/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import { IdempotencyEntry, resolveIdempotencyKey } from '@/lib/idempotency';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';
import { useRef } from 'react';

interface UseIncreasePasswordCapacityOptions {
  onSuccess?: (data: IncreaseCapacityResponse['content']) => void;
  onError?: (
    error: ErrorResponse<
      typeof creatorListsContract.postIncreaseCapacityContract
    >
  ) => void;
}

// 密碼名額增加 10 人（BE §8）。expectedLimitCount 傳目前的 limitCount，不傳新上限
export const useIncreasePasswordCapacity = (
  options: UseIncreasePasswordCapacityOptions = {}
) => {
  const queryClient = useQueryClient();
  const idempotencyRef = useRef<IdempotencyEntry>();

  const mutation = creatorListsQuery.increaseCapacity.useMutation({
    onSuccess: (response) => {
      idempotencyRef.current = undefined;
      const data = response.body.content;
      // 只用回應改寫編輯設定，不 invalidate：mock 重抓會回到額滿（§8）
      updateEntryCaches<typeof creatorListsContract.getCreatorListContract>(
        queryClient,
        listsKeys.editSettings(data.listID),
        (previousBody) => ({
          ...previousBody,
          content: {
            ...previousBody.content,
            password:
              previousBody.content.password?.id === data.passwordID
                ? { ...previousBody.content.password, capacity: data.capacity }
                : previousBody.content.password,
          },
        })
      );
      options.onSuccess?.(data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });

  const increaseCapacity = (
    listID: string,
    passwordID: string,
    currentLimitCount: number
  ) => {
    const body = { expectedLimitCount: currentLimitCount };
    idempotencyRef.current = resolveIdempotencyKey(
      idempotencyRef.current,
      JSON.stringify({ listID, passwordID, body })
    );
    mutation.mutate({
      params: { listID, passwordID },
      body,
      headers: { 'idempotency-key': idempotencyRef.current.key },
    });
  };

  return { ...mutation, mutate: increaseCapacity };
};
