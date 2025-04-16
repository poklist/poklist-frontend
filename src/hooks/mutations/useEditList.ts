import ApiPath from '@/config/apiPath';
import { Idea, List } from '@/constants/list';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { CreateListResponse, ListBody } from '@/types/List';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseEditListOptions {
  userCode: string; // to invalidate the useLists cache
  listOffset?: number;
  listLimit?: number;
  ideaOffset?: number;
  ideaLimit?: number;
  onSuccess?: (data: CreateListResponse) => void;
  onError?: (error: any) => void;
}

export const useEditList = ({
  userCode,
  listOffset = List.DEFAULT_FIRST_BATCH_OFFSET,
  listLimit = List.DEFAULT_BATCH_SIZE,
  ideaOffset = Idea.DEFAULT_FIRST_BATCH_OFFSET,
  ideaLimit = Idea.DEFAULT_BATCH_SIZE,
  onSuccess,
  onError,
}: UseEditListOptions) => {
  const { setShowingAlert } = useCommonStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      listID,
      editListRequest,
    }: {
      listID: number;
      editListRequest: ListBody;
    }) => {
      const response = await axios.put<IResponse<CreateListResponse>>(
        `${ApiPath.lists}/${listID}`,
        {
          listID,
          title: editListRequest.title,
          description: editListRequest.description,
          externalLink: editListRequest.externalLink,
          coverImage: editListRequest.coverImage,
          categoryID: editListRequest.categoryID,
        }
      );
      return response.data.content;
    },
    onSuccess: (data, { listID }) => {
      // Invalidate the list cache, trigger refetching
      if (!data) {
        throw new Error('Failed to edit list');
      }
      queryClient.refetchQueries({
        queryKey: ['lists', userCode, listOffset, listLimit],
      });
      queryClient.refetchQueries({
        queryKey: ['list', listID, ideaOffset, ideaLimit],
      });
      onSuccess?.(data);
    },
    onError: (error) => {
      setShowingAlert(true, { message: String(error) });
      onError?.(error);
    },
  });

  return {
    isEditListLoading: mutation.isPending,
    editList: mutation.mutate,
    editListAsync: mutation.mutateAsync,
  };
};
