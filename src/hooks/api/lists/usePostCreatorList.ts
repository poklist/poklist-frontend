import { creatorListsContract } from '@/api/contracts';
import {
  creatorListsQuery,
  PostCreatorListsRequest,
  PostCreatorListsResponse,
} from '@/api/query/creatorLists';
import { applyCreatedListToCaches } from '@/hooks/api/lists/applyCreatedListToCaches';
import { IdempotencyEntry, resolveIdempotencyKey } from '@/lib/idempotency';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';
import { useRef } from 'react';

interface UsePostCreatorListOptions {
  userCode: string;
  onSuccess?: (data: PostCreatorListsResponse['content']) => void;
  onError?: (
    error: ErrorResponse<typeof creatorListsContract.postCreatorListsContract>
  ) => void;
}

// 新的 POST /creator/lists（FEATURES.listLock 開啟時使用）。快取更新與 usePostNewList 相同。
export const usePostCreatorList = (options: UsePostCreatorListOptions) => {
  const queryClient = useQueryClient();
  const idempotencyRef = useRef<IdempotencyEntry>();

  const mutation = creatorListsQuery.post.useMutation({
    onSuccess: async (response) => {
      idempotencyRef.current = undefined;
      const data = response.body.content;
      try {
        await applyCreatedListToCaches(queryClient, options.userCode, {
          id: data.id,
          title: data.title,
          description: data.description,
          coverImage: data.coverImage,
          externalLink: data.externalLink,
          categoryID: data.categoryID,
          type: data.type,
        });
      } catch (error) {
        console.warn('Refetch failed, but list was created:', error);
      } finally {
        options.onSuccess?.(data);
      }
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });

  // 重送同一份內容沿用原 Idempotency-Key；內容改變或成功後才換新 key
  const createList = (body: PostCreatorListsRequest) => {
    idempotencyRef.current = resolveIdempotencyKey(
      idempotencyRef.current,
      JSON.stringify(body)
    );
    mutation.mutate({
      body,
      headers: { 'idempotency-key': idempotencyRef.current.key },
    });
  };

  return { ...mutation, mutate: createList };
};
