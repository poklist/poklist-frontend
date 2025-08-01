import ApiPath from '@/constants/apiPath';
import { List } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import { toast } from '@/hooks/useToast';
import axios from '@/lib/axios';
import { CreateListResponse, ListBody } from '@/types/List';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseCreateListOptions {
  userCode: string; // to invalidate the useLists cache
  offset?: number;
  limit?: number;
  onSuccess?: (data: CreateListResponse) => void;
  onError?: (error: Error) => void;
}

export const useCreateList = ({
  userCode,
  offset = List.DEFAULT_FIRST_BATCH_OFFSET,
  limit = List.DEFAULT_BATCH_SIZE,
  onSuccess,
  onError,
}: UseCreateListOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (listForm: ListBody) => {
      const params = {
        title: listForm.title,
        description: listForm.description,
        externalLink: listForm.externalLink,
        coverImage: listForm.coverImage,
        categoryID: listForm.categoryID,
      };

      const response = await axios.post<IResponse<CreateListResponse>>(
        ApiPath.lists,
        params
      );
      return response.data.content;
    },
    onSuccess: async (data) => {
      if (!data) {
        throw new Error('Failed to create list');
      }
      // 使列表緩存失效，觸發重新獲取
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.LISTS, userCode, offset, limit],
        refetchType: 'inactive',
      });
      onSuccess?.(data);
    },
    onError: (error) => {
      toast({
        title: String(error),
        variant: MessageType.ERROR,
      });
      onError?.(error);
    },
  });

  return {
    createList: mutation.mutate,
    createListAsync: mutation.mutateAsync,
    isCreateListLoading: mutation.isPending,
  };
};
