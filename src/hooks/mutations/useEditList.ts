import ApiPath from '@/constants/apiPath';
import { Idea, List } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
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
}

export const useEditList = ({
  userCode,
  listOffset = List.DEFAULT_FIRST_BATCH_OFFSET,
  listLimit = List.DEFAULT_BATCH_SIZE,
  ideaOffset = Idea.DEFAULT_FIRST_BATCH_OFFSET,
  ideaLimit = Idea.DEFAULT_BATCH_SIZE,
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
      if (!response.data.content) {
        throw new Error('Failed to edit list');
      }
      return response.data.content;
    },
    onSuccess: async (data) => {
      // Invalidate the list cache, trigger refetching
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.LISTS, userCode, listOffset, listLimit],
        refetchType: 'inactive',
      });
      // NOTE: I changed to listID to data.id.toString() to make the refetch work but idk why
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.LIST, data.id.toString(), ideaOffset, ideaLimit],
      });
    },
    onError: (error) => {
      setShowingAlert(true, { message: String(error) });
    },
  });

  return {
    isEditListLoading: mutation.isPending,
    editList: mutation.mutate,
    editListAsync: mutation.mutateAsync,
  };
};
