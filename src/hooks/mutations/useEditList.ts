import axios from '@/api/axios';
import ApiPath from '@/constants/apiPath';
import { Idea, List } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import listsKeys from '@/hooks/api/lists/keys';
import { toast } from '@/hooks/useToast';
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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.LISTS, userCode, listOffset, listLimit],
          refetchType: 'inactive',
        }),
        queryClient.invalidateQueries({
          queryKey: listsKeys.userLists(userCode),
          refetchType: 'inactive',
        }),
        // NOTE: I changed to listID to data.id.toString() to make the refetch work but idk why
        queryClient.refetchQueries({
          queryKey: [QueryKeys.LIST, data.id.toString(), ideaOffset, ideaLimit],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.INFINITE_IDEA, data.id.toString()],
          refetchType: 'inactive',
        }),
        queryClient.invalidateQueries({
          queryKey: listsKeys.infiniteIdeas(data.id.toString()),
        }),
      ]);
    },
    onError: (error) => {
      toast({
        title: error.message,
        variant: MessageType.ERROR,
      });
    },
  });

  return {
    editList: mutation.mutate,
    editListAsync: mutation.mutateAsync,
  };
};
