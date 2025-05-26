import ApiPath from '@/config/apiPath';
import { Idea } from '@/constants/list';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { EditIdeaResponse, IdeaPreview } from '@/types/Idea';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useEditIdea = () => {
  const { setShowingAlert } = useCommonStore();
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
      const ideaQueryKey = ['idea', data.id.toString()];

      const listQueryKey = [
        'list',
        data.listID.toString(),
        Idea.DEFAULT_FIRST_BATCH_OFFSET,
        Idea.DEFAULT_BATCH_SIZE,
      ];
      // Invalidate for triggering refetch
      await queryClient.invalidateQueries({ queryKey: ideaQueryKey });
      await queryClient.invalidateQueries({ queryKey: listQueryKey });
      await queryClient.refetchQueries({
        queryKey: ['infiniteList', data.id.toString()],
      });
    },
    onError: (error) => {
      setShowingAlert(true, { message: String(error) });
    },
  });

  return {
    editIdea: mutation.mutate,
    isEditIdeaLoading: mutation.isPending,
    isEditIdeaError: mutation.isError,
    editIdeaError: mutation.error,
  };
};

export default useEditIdea;
