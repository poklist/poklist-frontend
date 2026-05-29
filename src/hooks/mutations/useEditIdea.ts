import axios from '@/api/axios';
import ApiPath from '@/constants/apiPath';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import ideasKeys from '@/hooks/api/ideas/keys';
import listsKeys from '@/hooks/api/lists/keys';
import { toast } from '@/hooks/useToast';
import { EditIdeaResponse, IdeaPreview } from '@/types/Idea';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useEditIdea = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: IdeaPreview) => {
      const response = await axios.put<IResponse<EditIdeaResponse>>(
        `${ApiPath.ideas}/${params.id}`,
        params
      );
      if (!response.data.content) {
        throw new Error('Failed to edit idea');
      }
      return response.data.content;
    },
    onSuccess: async (data) => {
      const ideaQueryKey = [QueryKeys.IDEA, data.id.toString()];
      // Invalidate for triggering refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ideaQueryKey }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === QueryKeys.LIST &&
            query.queryKey[1] === data.listID.toString(),
        }),
        queryClient.invalidateQueries({
          queryKey: listsKeys.infiniteIdeas(data.listID.toString()),
        }),
        queryClient.invalidateQueries({
          queryKey: ideasKeys.idea(data.id.toString()),
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.INFINITE_IDEA, data.listID.toString()],
          refetchType: 'inactive',
        }),
        queryClient.invalidateQueries({
          queryKey: listsKeys.infiniteIdeas(data.listID.toString()),
          refetchType: 'inactive',
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
    editIdea: mutation.mutate,
    isEditIdeaError: mutation.isError,
    editIdeaError: mutation.error,
  };
};

export default useEditIdea;
