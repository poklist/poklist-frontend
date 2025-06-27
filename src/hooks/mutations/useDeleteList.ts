import ApiPath from '@/constants/apiPath';
import { List } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
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
  const { setShowingAlert } = useCommonStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (listID: number) => {
      const response = await axios.delete<IResponse<unknown>>(
        `${ApiPath.lists}/${listID}`
      );
      if (response.data.code != 200) {
        throw new Error('Failed to delete list');
      }
      return;
    },
    onSuccess: async (_, listID) => {
      // 移除已刪除列表的快取
      queryClient.removeQueries({
        queryKey: [QueryKeys.LIST, listID.toString()],
      });

      // 重新獲取列表預覽資料
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.LISTS, userCode, offset, limit],
      });

      onSuccess?.();
    },
    onError: (error) => {
      setShowingAlert(true, { message: String(error) });
      onError?.(error);
    },
  });

  return {
    deleteList: mutation.mutate,
    isDeleteListLoading: mutation.isPending,
    deleteListError: mutation.error,
  };
};
