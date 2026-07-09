import { listsContract, usersContract } from '@/api/contracts';
import { listsQuery } from '@/api/query/lists';
import listsKeys from '@/hooks/api/lists/keys';
import publishKeys from '@/hooks/api/publish/keys';
import usersKeys from '@/hooks/api/users/keys';
import { updateEntryCaches } from '@/hooks/api/utils';
import { adjustPublishLimitsCache } from '@/hooks/queries/publish/cachesUpdater';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@ts-rest/react-query';
import z from 'zod';

type UseDeleteListSchema = z.input<z.ZodObject<{ userCode: z.ZodString }>>;

type UseDeleteListOptions = UseDeleteListSchema & {
  onSuccess?: () => void;
  onError?: (
    error: ErrorResponse<typeof listsContract.deleteListsContract>
  ) => void;
};

export const useDeleteList = (options: UseDeleteListOptions) => {
  const queryClient = useQueryClient();

  return listsQuery.delete.useMutation({
    onSuccess: async (_, request) => {
      try {
        await queryClient.invalidateQueries({
          queryKey: listsKeys.userInfiniteLists(options.userCode),
          refetchType: 'all',
        });
        // 將單筆列表資料清空，而非刪除快取，為免因尚有 Component 仍在使用相關資料而重新 fetch
        queryClient.setQueryData(
          listsKeys.infiniteIdeas(request.params.listID),
          undefined
        );
        updateEntryCaches<typeof listsContract.getUserListsContract>(
          queryClient,
          listsKeys.userLists(options.userCode),
          (previousBody) => {
            return {
              ...previousBody,
              content: previousBody.content.filter(
                (list) => list.id !== request.params.listID
              ),
            };
          }
        );
        updateEntryCaches<typeof usersContract.getInfoContract>(
          queryClient,
          usersKeys.userInfo(options.userCode),
          (previousBody) => {
            return {
              ...previousBody,
              content: {
                ...previousBody.content,
                listCount: previousBody.content.listCount - 1,
              },
            };
          }
        );
        adjustPublishLimitsCache(queryClient, publishKeys.listsLimits(), -1);
      } catch (error) {
        console.warn('Refetch failed, but list was deleted:', error);
      } finally {
        options.onSuccess?.();
      }
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
};
