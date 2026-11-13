import { creatorListsContract } from '@/api/contracts';
import {
  creatorListsQuery,
  PatchCreatorListRequest,
  PatchCreatorListResponse,
} from '@/api/query/creatorLists';
import { applyUpdatedListToCaches } from '@/hooks/api/lists/applyUpdatedListToCaches';
import listsKeys from '@/hooks/api/lists/keys';
import { IdempotencyEntry, resolveIdempotencyKey } from '@/lib/idempotency';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';
import { useRef } from 'react';

interface UsePatchCreatorListOptions {
  userCode: string;
  onSuccess?: (data: PatchCreatorListResponse['content']) => void;
  onError?: (
    error: ErrorResponse<typeof creatorListsContract.patchCreatorListContract>
  ) => void;
}

// 新的 PATCH /creator/lists/:listId（BE §7）。快取更新與 usePutList 相同。
export const usePatchCreatorList = (options: UsePatchCreatorListOptions) => {
  const queryClient = useQueryClient();
  const idempotencyRef = useRef<IdempotencyEntry>();

  const mutation = creatorListsQuery.patch.useMutation({
    onSuccess: (response) => {
      idempotencyRef.current = undefined;
      const data = response.body.content;
      try {
        applyUpdatedListToCaches(queryClient, options.userCode, {
          id: data.id,
          title: data.title,
          description: data.description,
          coverImage: data.coverImage,
          externalLink: data.externalLink,
          categoryID: data.categoryID,
          type: data.type,
        });
        void queryClient.invalidateQueries({
          queryKey: listsKeys.editSettings(data.id),
        });
      } catch (error) {
        console.warn('Refetch failed, but list was edited:', error);
      } finally {
        options.onSuccess?.(data);
      }
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });

  // 重送同一份內容沿用原 Idempotency-Key；內容改變或成功後才換新 key
  const editList = (listID: string, body: PatchCreatorListRequest) => {
    idempotencyRef.current = resolveIdempotencyKey(
      idempotencyRef.current,
      JSON.stringify({ listID, body })
    );
    mutation.mutate({
      params: { listID },
      body,
      headers: { 'idempotency-key': idempotencyRef.current.key },
    });
  };

  return { ...mutation, mutate: editList };
};
