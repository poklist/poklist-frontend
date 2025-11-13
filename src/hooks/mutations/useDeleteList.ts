import ApiPath from '@/constants/apiPath';
import { List } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import { toast } from '@/hooks/useToast';
import axios from '@/lib/axios';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);

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
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async (_, listID) => {
      // 將單筆列表資料清空，而非刪除快取，為免因尚有 Component 仍在使用相關資料而重新 fetch
      queryClient.setQueryData([QueryKeys.LIST, listID.toString()], null);

      // 重新獲取列表預覽資料
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.LISTS, userCode, offset, limit],
        refetchType: 'inactive',
      });

      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: error.message,
        variant: MessageType.ERROR,
      });
      onError?.(error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  return {
    deleteList: mutation.mutate,
    isDeleteListLoading: mutation.isPending || isLoading,
    deleteListError: mutation.error,
  };
};
