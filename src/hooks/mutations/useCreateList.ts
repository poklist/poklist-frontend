import axios from '@/api/axios';
import ApiPath from '@/constants/apiPath';
import { List } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import { toast } from '@/hooks/useToast';
import { CreateListResponse, ListBody } from '@/types/List';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import listsKeys from '@/hooks/api/lists/keys';

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
      try {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.LISTS, userCode, offset, limit],
            refetchType: 'inactive',
          }),
          queryClient.invalidateQueries({
            queryKey: listsKeys.userLists(userCode),
            refetchType: 'inactive',
          }),
        ]);
      } catch (error) {
        console.warn('Refetch failed, but list was created:', error);
      }
      onSuccess?.(data);
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
    createList: mutation.mutate,
    createListAsync: mutation.mutateAsync,
  };
};
