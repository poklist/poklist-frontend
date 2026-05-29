import axios from '@/api/axios';
import ApiPath from '@/constants/apiPath';
import { List } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import listsKeys from '@/hooks/api/lists/keys';
import { toast } from '@/hooks/useToast';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseDeleteListOptions {
  userCode: string; // to invalidate the useLists cache
  offset?: number;
  limit?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDeleteList = ({
  userCode,
  offset = List.DEFAULT_FIRST_BATCH_OFFSET,
  limit = List.DEFAULT_BATCH_SIZE,
  onSuccess,
  onError,
}: UseDeleteListOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (listID: number | string) => {
      const response = await axios.delete<IResponse<unknown>>(
        `${ApiPath.lists}/${listID}`
      );
      if (response.data.code != 200) {
        throw new Error('Failed to delete list');
      }
      return;
    },
    onSuccess: async (_, listID) => {
      try {
        // 將單筆列表資料清空，而非刪除快取，為免因尚有 Component 仍在使用相關資料而重新 fetch
        queryClient.setQueryData([QueryKeys.LIST, listID.toString()], null);
        queryClient.setQueryData(listsKeys.infiniteIdeas(listID.toString()), undefined);
        // 重新獲取列表預覽資料
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.LISTS, userCode, offset, limit],
            refetchType: 'inactive',
          }),
          queryClient.invalidateQueries({
            queryKey: listsKeys.userLists(userCode),
            refetchType: 'all',
          }),
          queryClient.invalidateQueries({
            queryKey: listsKeys.infiniteIdeas(listID.toString()),
            refetchType: 'inactive',
          }),
        ]);
        onSuccess?.();
      } catch (error) {
        console.warn('Refetch failed, but list was deleted:', error);
      }
    },
    onError: (error) => {
      toast({
        title: error.message,
        variant: MessageType.ERROR,
      });
      onError?.(error);
    },
  });

  return {
    deleteList: mutation.mutate,
    deleteListError: mutation.error,
  };
};
